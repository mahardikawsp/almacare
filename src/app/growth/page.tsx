'use client'

import { useState, useEffect } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { GrowthRecordForm } from '@/components/growth/GrowthRecordForm'
import { GrowthHistory } from '@/components/growth/GrowthHistory'
import { GrowthCharts } from '@/components/growth/GrowthCharts'
import { GrowthStatusGrid } from '@/components/growth/GrowthStatusIndicator'
import { Button } from '@/components/ui/button'
import type { GrowthRecordWithAnalysis } from '@/lib/growth-service'
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
                        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                            Pemantauan Pertumbuhan
                        </h1>
                        <p className="text-neutral-600 font-medium">
                            Pantau pertumbuhan anak dengan standar WHO dan dapatkan analisis mendalam
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="mb-6">
                        <div className="bg-white rounded-2xl p-2 shadow-soft">
                            <div className="flex space-x-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon
                                    return (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === tab.key
                                                ? 'bg-picton-blue text-white shadow-warm'
                                                : 'text-gray hover:bg-alice-blue hover:text-berkeley-blue'
                                                }`}
                                        >
                                            <Icon
                                                className={`h-5 w-5 ${activeTab === tab.key ? 'text-white' : 'text-neutral-400'
                                                    }`}
                                            />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
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
                            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
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
                        <div className="mt-8 bg-primary-50 border border-primary-200 rounded-2xl p-6 shadow-soft">
                            <div className="text-center">
                                <ChartIcon className="w-12 h-12 text-primary-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-primary-900 mb-2">
                                    Belum Ada Data Pertumbuhan
                                </h3>
                                <p className="text-primary-700 mb-4 font-medium">
                                    Mulai pantau pertumbuhan anak dengan menambahkan data pengukuran pertama.
                                </p>
                                <Button
                                    onClick={() => setActiveTab('form')}
                                    variant="default"
                                >
                                    Tambah Data Pertama
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        </AuthGuard>
    )
}