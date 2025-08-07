'use client'

import { useState, useEffect } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { GrowthRecordForm } from '@/components/growth/GrowthRecordForm'
import { GrowthHistory } from '@/components/growth/GrowthHistory'
import { GrowthCharts } from '@/components/growth/GrowthCharts'
import { GrowthStatusGrid } from '@/components/growth/GrowthStatusIndicator'

import type { GrowthRecordWithAnalysis } from '@/lib/growth-service'
import { useChildStore } from '@/stores/childStore'
import { PlusIcon } from '@/components/icons/PlusIcon'
import { ChartIcon } from '@/components/icons/ChartIcon'
import { GrowthIcon } from '@/components/icons/GrowthIcon'

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
                <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50">
                    <div className="p-4 sm:p-6">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                            {/* <div className="w-12 h-12 bg-gradient-to-br from-picton-blue to-berkeley-blue rounded-2xl flex items-center justify-center shadow-soft">
                                <GrowthIcon className="w-6 h-6 text-white" />
                            </div> */}
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-900">Pantau Tumbuh</h1>
                                <p className="text-neutral-600 font-medium">
                                    Pantau pertumbuhan {selectedChild?.name || 'anak'} dengan standar WHO
                                </p>
                            </div>
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
                                                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                                                    : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-700'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="hidden sm:inline">{tab.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-8">
                            {activeTab === 'form' && (
                                <div className="">
                                    {/* Background decoration */}
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-50 to-pink-50 rounded-full -translate-y-20 translate-x-20 opacity-50"></div>

                                    <div className="relative z-10">
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
                                    </div>
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div className="">
                                    <GrowthHistory onEditRecord={handleEditRecord} />
                                </div>
                            )}

                            {activeTab === 'charts' && (
                                <div className="">
                                    <GrowthCharts />
                                </div>
                            )}
                        </div>

                        {/* Latest Growth Status */}
                        {activeTab !== 'form' && latestRecord && (
                            <div className="mt-8">
                                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
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
                            </div>
                        )}

                        {/* No Data Message */}
                        {activeTab !== 'form' && !latestRecord && !isLoadingLatest && (
                            <div className="mt-8 bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 rounded-3xl p-8 shadow-lg">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-orange-800 mb-3">
                                        Belum Ada Data Pertumbuhan
                                    </h3>
                                    <p className="text-orange-700 mb-6 font-medium leading-relaxed">
                                        Mulai pantau pertumbuhan anak dengan menambahkan data pengukuran pertama.
                                    </p>
                                    <button
                                        onClick={() => setActiveTab('form')}
                                        className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Tambah Data Pertama
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AppLayout>
        </AuthGuard>
    )
}