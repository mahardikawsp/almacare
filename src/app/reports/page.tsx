'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useChildStore } from '@/stores/childStore'
import { ReportGenerator } from '@/components/reports/ReportGenerator'
import { PrintLayout } from '@/components/reports/PrintLayout'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function ReportsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { selectedChild, children } = useChildStore()
    const [activeTab, setActiveTab] = useState<'generator' | 'print'>('generator')
    const [reportData, setReportData] = useState<{
        growthRecords?: Array<{
            date: string;
            weight: number;
            height: number;
            headCircumference?: number | null;
            ageInMonths?: number;
            analysis?: {
                weightForHeight?: { zScore?: number };
                weightForAge?: { status?: string };
                heightForAge?: { status?: string }
            }
        }>
        immunizationRecords?: Array<{
            status: string;
            schedule: { vaccineName: string };
            scheduledDate?: string;
            actualDate?: string | null;
            notes?: string | null;
        }>
        mpasiData?: {
            favorites?: Array<{ recipe?: { name?: string } }>
            nutritionSummary?: {
                daily?: { calories: number; protein: number; fat: number; carbohydrates: number }
                recommended?: { calories: number; protein: number; fat: number; carbohydrates: number }
                percentage?: { calories: number; protein: number; fat: number; carbohydrates: number }
            }
        }
    } | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        }
    }, [status, router])

    useEffect(() => {
        // Load report data when child is selected
        if (selectedChild && activeTab === 'print') {
            loadReportData()
        }
    }, [selectedChild, activeTab])

    const loadReportData = async () => {
        if (!selectedChild) return

        setIsLoading(true)
        try {
            // Fetch growth data
            const growthResponse = await fetch(`/api/growth?childId=${selectedChild.id}`)
            const growthResult = await growthResponse.json()

            // Fetch immunization data
            const immunizationResponse = await fetch(`/api/immunization/records?childId=${selectedChild.id}`)
            const immunizationResult = await immunizationResponse.json()

            // Fetch MPASI data
            const mpasiResponse = await fetch(`/api/mpasi/favorites?childId=${selectedChild.id}`)
            const mpasiResult = await mpasiResponse.json()

            const nutritionResponse = await fetch(`/api/mpasi/nutrition-summary?childId=${selectedChild.id}`)
            const nutritionResult = await nutritionResponse.json()

            setReportData({
                growthRecords: growthResult.data || [],
                immunizationRecords: immunizationResult.records || [],
                mpasiData: {
                    favorites: mpasiResult.favorites || [],
                    nutritionSummary: nutritionResult.summary || {
                        daily: { calories: 0, protein: 0, fat: 0, carbohydrates: 0 },
                        recommended: { calories: 800, protein: 20, fat: 30, carbohydrates: 100 },
                        percentage: { calories: 0, protein: 0, fat: 0, carbohydrates: 0 }
                    }
                }
            })
        } catch (error) {
            console.error('Error loading report data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => router.back()}
                                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-900">
                                        Laporan & Ekspor
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        Buat dan kelola laporan kesehatan anak
                                    </p>
                                </div>
                            </div>

                            {/* Child Selector */}
                            {children.length > 1 && (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">Anak:</span>
                                    <select
                                        value={selectedChild?.id || ''}
                                        onChange={(e) => {
                                            const child = children.find(c => c.id === e.target.value)
                                            if (child) {
                                                useChildStore.getState().setSelectedChild(child)
                                            }
                                        }}
                                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Pilih Anak</option>
                                        {children.map(child => (
                                            <option key={child.id} value={child.id}>
                                                {child.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="flex space-x-8">
                            <button
                                onClick={() => setActiveTab('generator')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'generator'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Generator Laporan
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('print')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'print'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Preview & Cetak
                                </div>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {!selectedChild ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-yellow-800 mb-2">
                                Pilih Anak Terlebih Dahulu
                            </h3>
                            <p className="text-yellow-700">
                                Silakan pilih anak dari dropdown di atas untuk membuat laporan kesehatan.
                            </p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'generator' && (
                                <ReportGenerator />
                            )}

                            {activeTab === 'print' && (
                                <div className="space-y-6">
                                    {isLoading ? (
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                            <p className="text-gray-600">Memuat data laporan...</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Print Options */}
                                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                    Opsi Cetak
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <button
                                                        onClick={() => {
                                                            // Set print mode for comprehensive report
                                                            window.print()
                                                        }}
                                                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                                                    >
                                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="font-medium text-gray-900">Laporan Lengkap</div>
                                                            <div className="text-sm text-gray-600">Semua data kesehatan</div>
                                                        </div>
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            // Set print mode for growth report only
                                                            window.print()
                                                        }}
                                                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                                                    >
                                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                            </svg>
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="font-medium text-gray-900">Laporan Pertumbuhan</div>
                                                            <div className="text-sm text-gray-600">Data pertumbuhan saja</div>
                                                        </div>
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            // Set print mode for immunization certificate
                                                            window.print()
                                                        }}
                                                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                                                    >
                                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="font-medium text-gray-900">Sertifikat Imunisasi</div>
                                                            <div className="text-sm text-gray-600">Riwayat imunisasi</div>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Print Preview */}
                                            <PrintLayout
                                                child={selectedChild}
                                                reportType="comprehensive"
                                                data={reportData || undefined}
                                                options={{
                                                    includeCharts: true,
                                                    clinicName: 'AlmaCare Clinic',
                                                    doctorName: 'Dokter Anak'
                                                }}
                                            />
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthGuard>
    )
}