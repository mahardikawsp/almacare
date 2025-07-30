'use client'

import { useState, useEffect } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { GrowthRecordForm } from '@/components/growth/GrowthRecordForm'
import { GrowthHistory } from '@/components/growth/GrowthHistory'
import { GrowthCharts } from '@/components/growth/GrowthCharts'
import { GrowthStatusGrid } from '@/components/growth/GrowthStatusIndicator'
import { GrowthRecordWithAnalysis } from '@/lib/growth-service'
import { useChildStore } from '@/stores/childStore'
import { PlusIcon } from '@/components/icons/PlusIcon'
import { ChartIcon } from '@/components/icons/ChartIcon'

type ActiveTab = 'form' | 'history' | 'charts'

export default function GrowthPage() {
    const { selectedChild } = useChildStore()
    const [activeTab, setActiveTab] = useState<ActiveTab>('form')
    const [editingRecord, setEditingRecord] = useState<GrowthRecordWithAnalysis | null>(null)
    const [latestRecord, setLatestRecord] = useState<GrowthRecordWithAnalysis | null>(null)
    const [isLoadingLatest, setIsLoadingLatest] = useState(false)

    useEffect(() => {
        if (selectedChild) {
            fetchLatestRecord()
        }
    }, [selectedChild]) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchLatestRecord = async () => {
        if (!selectedChild) return

        setIsLoadingLatest(true)
        try {
            const response = await fetch(`/api/growth?childId=${selectedChild.id}`)
            const result = await response.json()

            if (result.success && result.data && result.data.length > 0) {
                // Get the most recent record
                const sortedRecords = result.data.sort((a: GrowthRecordWithAnalysis, b: GrowthRecordWithAnalysis) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                setLatestRecord(sortedRecords[0])
            } else {
                setLatestRecord(null)
            }
        } catch (error) {
            console.error('Error fetching latest record:', error)
            setLatestRecord(null)
        } finally {
            setIsLoadingLatest(false)
        }
    }

    const handleEditRecord = (record: GrowthRecordWithAnalysis) => {
        setEditingRecord(record)
        setActiveTab('form')
    }

    const handleFormSuccess = () => {
        setEditingRecord(null)
        // Refresh latest record
        fetchLatestRecord()
        // Switch to history tab to see the new/updated record
        setActiveTab('history')
    }

    const handleFormCancel = () => {
        setEditingRecord(null)
        setActiveTab('history')
    }

    const tabs = [
        {
            key: 'form' as ActiveTab,
            label: editingRecord ? 'Edit Data' : 'Tambah Data',
            icon: PlusIcon,
            color: 'text-emerald-600'
        },
        {
            key: 'history' as ActiveTab,
            label: 'Riwayat',
            icon: ChartIcon,
            color: 'text-blue-600'
        },
        {
            key: 'charts' as ActiveTab,
            label: 'Grafik',
            icon: ChartIcon,
            color: 'text-purple-600'
        }
    ]

    return (
        <AuthGuard>
            <AppLayout>
                <div>
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Pemantauan Pertumbuhan
                        </h1>
                        <p className="text-gray-600">
                            Pantau pertumbuhan anak dengan standar WHO dan dapatkan analisis mendalam
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon
                                    return (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key
                                                ? `border-emerald-500 ${tab.color}`
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            <Icon
                                                className={`-ml-0.5 mr-2 h-5 w-5 ${activeTab === tab.key ? tab.color : 'text-gray-400 group-hover:text-gray-500'
                                                    }`}
                                            />
                                            {tab.label}
                                        </button>
                                    )
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-6">
                        {activeTab === 'form' && (
                            <GrowthRecordForm
                                onSuccess={handleFormSuccess}
                                onCancel={editingRecord ? handleFormCancel : undefined}
                                initialData={editingRecord ? {
                                    date: new Date(editingRecord.date).toISOString().split('T')[0],
                                    weight: editingRecord.weight,
                                    height: editingRecord.height,
                                    headCircumference: editingRecord.headCircumference || undefined
                                } : undefined}
                                recordId={editingRecord?.id}
                            />
                        )}

                        {activeTab === 'history' && (
                            <GrowthHistory onEditRecord={handleEditRecord} />
                        )}

                        {activeTab === 'charts' && (
                            <GrowthCharts />
                        )}
                    </div>

                    {/* Latest Growth Status */}
                    {activeTab !== 'form' && latestRecord && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Status Pertumbuhan Terkini
                            </h3>
                            <GrowthStatusGrid
                                weightForAge={latestRecord.analysis.weightForAge}
                                heightForAge={latestRecord.analysis.heightForAge}
                                weightForHeight={latestRecord.analysis.weightForHeight}
                                headCircumferenceForAge={latestRecord.analysis.headCircumferenceForAge}
                                measurements={{
                                    weight: latestRecord.weight,
                                    height: latestRecord.height,
                                    headCircumference: latestRecord.headCircumference || undefined
                                }}
                                size="md"
                            />
                        </div>
                    )}

                    {/* No Data Message */}
                    {activeTab !== 'form' && !latestRecord && !isLoadingLatest && (
                        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="text-center">
                                <ChartIcon className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-blue-900 mb-2">
                                    Belum Ada Data Pertumbuhan
                                </h3>
                                <p className="text-blue-700 mb-4">
                                    Mulai pantau pertumbuhan anak dengan menambahkan data pengukuran pertama.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('form')}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Tambah Data Pertama
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        </AuthGuard>
    )
}