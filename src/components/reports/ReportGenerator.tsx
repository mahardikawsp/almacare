'use client'

import { useState } from 'react'
import { useChildStore } from '@/stores/childStore'
import { PDFExportModal, type ExportOptions } from './PDFExportModal'
import { PDFReportService, type ComprehensiveReportData, type GrowthReportData, type ImmunizationReportData } from '@/lib/pdf-report-service'
import { format, subMonths } from 'date-fns'
import { id } from 'date-fns/locale'

interface ReportGeneratorProps {
    className?: string
}

export function ReportGenerator({ className = '' }: ReportGeneratorProps) {
    const { selectedChild } = useChildStore()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [reportType, setReportType] = useState<'comprehensive' | 'growth' | 'immunization'>('comprehensive')
    const [isGenerating, setIsGenerating] = useState(false)

    const handleExportRequest = (type: 'comprehensive' | 'growth' | 'immunization') => {
        if (!selectedChild) return
        setReportType(type)
        setIsModalOpen(true)
    }

    const handleExport = async (options: ExportOptions) => {
        if (!selectedChild) return

        setIsGenerating(true)
        try {
            // Fetch data based on report type
            const dateRange = options.dateRange ? {
                start: new Date(options.dateRange.start),
                end: new Date(options.dateRange.end)
            } : {
                start: subMonths(new Date(), 12),
                end: new Date()
            }

            switch (options.reportType) {
                case 'comprehensive':
                    await generateComprehensiveReport(options, dateRange)
                    break
                case 'growth':
                    await generateGrowthReport(options, dateRange)
                    break
                case 'immunization':
                    await generateImmunizationReport(options, dateRange)
                    break
            }

            // Handle email sending if enabled
            if (options.emailOptions?.enabled && options.emailOptions.recipients.length > 0) {
                await sendReportByEmail(options)
            }

            // Show success notification
            showNotification('success', 'Laporan berhasil dibuat dan diunduh')

        } catch (error) {
            console.error('Error generating report:', error)
            showNotification('error', 'Gagal membuat laporan. Silakan coba lagi.')
        } finally {
            setIsGenerating(false)
        }
    }

    const generateComprehensiveReport = async (
        options: ExportOptions,
        dateRange: { start: Date; end: Date }
    ) => {
        if (!selectedChild) return

        // Fetch growth data
        const growthResponse = await fetch(`/api/growth?childId=${selectedChild.id}&start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`)
        const growthResult = await growthResponse.json()

        // Fetch immunization data
        const immunizationResponse = await fetch(`/api/immunization/records?childId=${selectedChild.id}`)
        const immunizationResult = await immunizationResponse.json()

        // Fetch MPASI data if needed
        let mpasiData = undefined
        if (options.includeMPASIData) {
            const mpasiResponse = await fetch(`/api/mpasi/favorites?childId=${selectedChild.id}`)
            const mpasiResult = await mpasiResponse.json()

            const nutritionResponse = await fetch(`/api/mpasi/nutrition-summary?childId=${selectedChild.id}`)
            const nutritionResult = await nutritionResponse.json()

            mpasiData = {
                favorites: mpasiResult.favorites || [],
                nutritionSummary: nutritionResult.summary || {
                    daily: { calories: 0, protein: 0, fat: 0, carbohydrates: 0 },
                    recommended: { calories: 800, protein: 20, fat: 30, carbohydrates: 100 },
                    percentage: { calories: 0, protein: 0, fat: 0, carbohydrates: 0 }
                }
            }
        }

        // Prepare comprehensive report data
        const reportData: ComprehensiveReportData = {
            child: selectedChild,
            growth: {
                child: selectedChild,
                records: growthResult.data || [],
                latestRecord: growthResult.data?.[0],
                growthTrend: calculateGrowthTrend(growthResult.data || [])
            },
            immunization: {
                child: selectedChild,
                records: immunizationResult.records || [],
                completionRate: calculateCompletionRate(immunizationResult.records || []),
                overdueVaccines: (immunizationResult.records || []).filter((r: { status: string }) => r.status === 'OVERDUE'),
                upcomingVaccines: (immunizationResult.records || []).filter((r: { status: string }) => r.status === 'SCHEDULED')
            },
            mpasi: mpasiData,
            generatedAt: new Date(),
            reportPeriod: dateRange
        }

        // Generate PDF
        await PDFReportService.generateComprehensiveReport(reportData, {
            filename: options.filename,
            includeCharts: options.includeCharts,
            clinicName: options.clinicName,
            doctorName: options.doctorName
        })
    }

    const generateGrowthReport = async (
        options: ExportOptions,
        dateRange: { start: Date; end: Date }
    ) => {
        if (!selectedChild) return

        // Fetch growth data
        const response = await fetch(`/api/growth?childId=${selectedChild.id}&start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`)
        const result = await response.json()

        const reportData: GrowthReportData = {
            child: selectedChild,
            records: result.data || [],
            latestRecord: result.data?.[0],
            growthTrend: calculateGrowthTrend(result.data || [])
        }

        await PDFReportService.generateGrowthReport(reportData, {
            filename: options.filename,
            includeCharts: options.includeCharts,
            clinicName: options.clinicName,
            doctorName: options.doctorName
        })
    }

    const generateImmunizationReport = async (
        options: ExportOptions,
        dateRange: { start: Date; end: Date }
    ) => {
        if (!selectedChild) return

        // Fetch immunization data
        const response = await fetch(`/api/immunization/records?childId=${selectedChild.id}`)
        const result = await response.json()

        const records = result.records || []
        const reportData: ImmunizationReportData = {
            child: selectedChild,
            records,
            completionRate: calculateCompletionRate(records),
            overdueVaccines: records.filter((r: { status: string }) => r.status === 'OVERDUE'),
            upcomingVaccines: records.filter((r: { status: string }) => r.status === 'SCHEDULED')
        }

        await PDFReportService.generateImmunizationCertificate(reportData, {
            filename: options.filename,
            clinicName: options.clinicName,
            doctorName: options.doctorName
        })
    }

    const sendReportByEmail = async (options: ExportOptions) => {
        try {
            const response = await fetch('/api/reports/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    recipients: options.emailOptions?.recipients,
                    subject: options.emailOptions?.subject,
                    message: options.emailOptions?.message,
                    childId: selectedChild?.id,
                    reportType: options.reportType,
                    filename: options.filename
                })
            })

            if (!response.ok) {
                throw new Error('Failed to send email')
            }

            showNotification('success', 'Laporan berhasil dikirim via email')
        } catch (error) {
            console.error('Error sending email:', error)
            showNotification('warning', 'Laporan berhasil dibuat, tetapi gagal dikirim via email')
        }
    }

    const calculateGrowthTrend = (records: Array<{ date: string; weight: number; height: number; analysis?: { weightForHeight?: { zScore?: number } } }>) => {
        if (records.length < 2) {
            return {
                weight: 'stable' as const,
                height: 'stable' as const,
                weightForHeight: 'stable' as const
            }
        }

        const sorted = records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        const latest = sorted[sorted.length - 1]
        const previous = sorted[sorted.length - 2]

        return {
            weight: latest.weight > previous.weight ? 'increasing' as const :
                latest.weight < previous.weight ? 'decreasing' as const : 'stable' as const,
            height: latest.height > previous.height ? 'increasing' as const :
                latest.height < previous.height ? 'decreasing' as const : 'stable' as const,
            weightForHeight: (latest.analysis?.weightForHeight?.zScore ?? 0) > (previous.analysis?.weightForHeight?.zScore ?? 0) ? 'improving' as const :
                (latest.analysis?.weightForHeight?.zScore ?? 0) < (previous.analysis?.weightForHeight?.zScore ?? 0) ? 'declining' as const : 'stable' as const
        }
    }

    const calculateCompletionRate = (records: Array<{ status: string }>) => {
        if (records.length === 0) return 0
        const completed = records.filter(r => r.status === 'COMPLETED').length
        return (completed / records.length) * 100
    }

    const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
        // In a real implementation, this would use the notification store
        const toast = document.createElement('div')
        toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white font-medium ${type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
            }`
        toast.textContent = message

        document.body.appendChild(toast)
        setTimeout(() => toast.remove(), 5000)
    }

    if (!selectedChild) {
        return (
            <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
                <p className="text-yellow-800">
                    Pilih anak terlebih dahulu untuk membuat laporan.
                </p>
            </div>
        )
    }

    return (
        <>
            <div className={`bg-white rounded-2xl shadow-soft border border-neutral-200 p-6 ${className}`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-picton-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-neutral-900">
                            Generator Laporan
                        </h2>
                        <p className="text-sm text-neutral-600 font-medium">
                            Buat dan unduh laporan kesehatan untuk {selectedChild.name}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Comprehensive Report */}
                    <div className="border border-neutral-200 rounded-xl p-4 hover:border-picton-blue hover:bg-alice-blue transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-picton-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="font-medium text-neutral-900">Laporan Lengkap</h3>
                        </div>
                        <p className="text-sm text-neutral-600 mb-4 font-medium">
                            Laporan komprehensif mencakup pertumbuhan, imunisasi, dan MPASI
                        </p>
                        <button
                            onClick={() => handleExportRequest('comprehensive')}
                            disabled={isGenerating}
                            className="w-full px-4 py-2 bg-gradient-to-r from-picton-blue to-berkeley-blue text-white rounded-xl hover:from-blue-500 hover:to-blue-800 transition-colors disabled:opacity-50 text-sm font-medium shadow-soft"
                        >
                            {isGenerating ? 'Membuat...' : 'Buat Laporan'}
                        </button>
                    </div>

                    {/* Growth Report */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="font-medium text-gray-900">Laporan Pertumbuhan</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Analisis detail pertumbuhan dengan grafik dan rekomendasi
                        </p>
                        <button
                            onClick={() => handleExportRequest('growth')}
                            disabled={isGenerating}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm font-medium"
                        >
                            Buat Laporan
                        </button>
                    </div>

                    {/* Immunization Certificate */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-medium text-gray-900">Sertifikat Imunisasi</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Sertifikat resmi riwayat imunisasi anak
                        </p>
                        <button
                            onClick={() => handleExportRequest('immunization')}
                            disabled={isGenerating}
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm font-medium"
                        >
                            Buat Sertifikat
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Ringkasan Data</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">-</div>
                            <div className="text-gray-600">Data Pertumbuhan</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">-</div>
                            <div className="text-gray-600">Imunisasi Selesai</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">-</div>
                            <div className="text-gray-600">Resep Favorit</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {format(new Date(), 'MMM yyyy', { locale: id })}
                            </div>
                            <div className="text-gray-600">Periode Aktif</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Export Modal */}
            <PDFExportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                child={selectedChild}
                onExport={handleExport}
                reportType={reportType}
            />
        </>
    )
}