'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import type { GrowthRecord, ImmunizationRecordWithSchedule } from '@/types'

interface Child {
    id: string
    name: string
    gender: 'MALE' | 'FEMALE'
    birthDate: Date
    relationship: string
    userId: string
}

interface PrintLayoutProps {
    child: Child
    reportType: 'comprehensive' | 'growth' | 'immunization'
    data?: {
        growthRecords?: Array<{
            date: string;
            weight: number;
            height: number;
            headCircumference?: number | null;
            analysis?: {
                weightForAge?: { status?: string };
                heightForAge?: { status?: string };
                weightForHeight?: { zScore?: number }
            };
            ageInMonths?: number
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
    }
    options?: {
        clinicName?: string
        doctorName?: string
        includeCharts?: boolean
    }
}

export function PrintLayout({ child, reportType, data, options }: PrintLayoutProps) {
    const [isPrintMode, setIsPrintMode] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia('print')
        const handlePrintChange = (e: MediaQueryListEvent) => {
            setIsPrintMode(e.matches)
        }

        setIsPrintMode(mediaQuery.matches)
        mediaQuery.addEventListener('change', handlePrintChange)

        return () => mediaQuery.removeEventListener('change', handlePrintChange)
    }, [])

    const printStyles = `
        @media print {
            @page {
                size: A4;
                margin: 1.5cm;
            }
            
            body * {
                visibility: hidden;
            }
            
            .print-container, .print-container * {
                visibility: visible;
            }
            
            .print-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                max-width: none;
                margin: 0;
                padding: 0;
                box-shadow: none;
                border: none;
                font-family: 'Times New Roman', serif;
                font-size: 12pt;
                line-height: 1.4;
                color: #000;
            }
            
            .print-header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #000;
                padding-bottom: 20px;
            }
            
            .print-title {
                font-size: 18pt;
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .print-subtitle {
                font-size: 14pt;
                margin-bottom: 5px;
            }
            
            .print-section {
                margin-bottom: 25px;
                page-break-inside: avoid;
            }
            
            .print-section-title {
                font-size: 14pt;
                font-weight: bold;
                margin-bottom: 10px;
                border-bottom: 1px solid #000;
                padding-bottom: 5px;
            }
            
            .print-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
            }
            
            .print-table th,
            .print-table td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
                font-size: 11pt;
            }
            
            .print-table th {
                background-color: #f0f0f0;
                font-weight: bold;
            }
            
            .print-info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 20px;
            }
            
            .print-info-item {
                margin-bottom: 8px;
            }
            
            .print-info-label {
                font-weight: bold;
                display: inline-block;
                width: 120px;
            }
            
            .print-footer {
                position: fixed;
                bottom: 1cm;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 10pt;
                color: #666;
                border-top: 1px solid #ccc;
                padding-top: 10px;
            }
            
            .no-print {
                display: none !important;
            }
            
            .page-break {
                page-break-before: always;
            }
            
            .avoid-break {
                page-break-inside: avoid;
            }
        }
    `

    const handlePrint = () => {
        window.print()
    }

    const getReportTitle = () => {
        switch (reportType) {
            case 'comprehensive': return 'LAPORAN KESEHATAN ANAK LENGKAP'
            case 'growth': return 'LAPORAN PERTUMBUHAN ANAK'
            case 'immunization': return 'SERTIFIKAT IMUNISASI'
            default: return 'LAPORAN KESEHATAN'
        }
    }

    const renderChildInfo = () => (
        <div className="print-section">
            <h2 className="print-section-title">Informasi Anak</h2>
            <div className="print-info-grid">
                <div>
                    <div className="print-info-item">
                        <span className="print-info-label">Nama:</span>
                        {child.name}
                    </div>
                    <div className="print-info-item">
                        <span className="print-info-label">Jenis Kelamin:</span>
                        {child.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}
                    </div>
                    <div className="print-info-item">
                        <span className="print-info-label">Tanggal Lahir:</span>
                        {format(new Date(child.birthDate), 'dd MMMM yyyy', { locale: id })}
                    </div>
                </div>
                <div>
                    <div className="print-info-item">
                        <span className="print-info-label">Hubungan:</span>
                        {child.relationship}
                    </div>
                    <div className="print-info-item">
                        <span className="print-info-label">Usia:</span>
                        {calculateAge(new Date(child.birthDate))}
                    </div>
                </div>
            </div>
        </div>
    )

    const renderGrowthData = () => {
        if (!data?.growthRecords || data.growthRecords.length === 0) return null

        return (
            <div className="print-section">
                <h2 className="print-section-title">Data Pertumbuhan</h2>
                <table className="print-table">
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Usia (bulan)</th>
                            <th>Berat (kg)</th>
                            <th>Tinggi (cm)</th>
                            <th>Lingkar Kepala (cm)</th>
                            <th>Status Gizi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.growthRecords.slice(0, 10).map((record, index) => (
                            <tr key={index}>
                                <td>{record.date}</td>
                                <td>{record.ageInMonths}</td>
                                <td>{record.weight}</td>
                                <td>{record.height}</td>
                                <td>{record.headCircumference || '-'}</td>
                                <td>{getGrowthStatus(record.analysis)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    const renderImmunizationData = () => {
        if (!data?.immunizationRecords || data.immunizationRecords.length === 0) return null

        return (
            <div className="print-section">
                <h2 className="print-section-title">Riwayat Imunisasi</h2>
                <table className="print-table">
                    <thead>
                        <tr>
                            <th>Vaksin</th>
                            <th>Usia (bulan)</th>
                            <th>Tanggal Terjadwal</th>
                            <th>Tanggal Diberikan</th>
                            <th>Status</th>
                            <th>Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.immunizationRecords.map((record, index) => (
                            <tr key={index}>
                                <td>{record.schedule.vaccineName}</td>
                                <td>-</td>
                                <td>{record.scheduledDate || '-'}</td>
                                <td>{record.actualDate || '-'}</td>
                                <td>{getImmunizationStatus(record.status)}</td>
                                <td>{record.notes || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    const renderMPASIData = () => {
        if (!data?.mpasiData) return null

        return (
            <div className="print-section">
                <h2 className="print-section-title">Data MPASI</h2>
                <div className="print-info-grid">
                    <div>
                        <h3>Ringkasan Gizi Harian</h3>
                        <div className="print-info-item">
                            <span className="print-info-label">Kalori:</span>
                            {data.mpasiData.nutritionSummary?.daily?.calories || 0} kkal
                        </div>
                        <div className="print-info-item">
                            <span className="print-info-label">Protein:</span>
                            {data.mpasiData.nutritionSummary?.daily?.protein || 0} g
                        </div>
                        <div className="print-info-item">
                            <span className="print-info-label">Lemak:</span>
                            {data.mpasiData.nutritionSummary?.daily?.fat || 0} g
                        </div>
                        <div className="print-info-item">
                            <span className="print-info-label">Karbohidrat:</span>
                            {data.mpasiData.nutritionSummary?.daily?.carbohydrates || 0} g
                        </div>
                    </div>
                    <div>
                        <h3>Resep Favorit</h3>
                        {data.mpasiData.favorites?.slice(0, 5).map((favorite: { recipe?: { name?: string } }, index: number) => (
                            <div key={index} className="print-info-item">
                                • {favorite.recipe?.name || 'Resep tidak diketahui'}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const calculateAge = (birthDate: Date) => {
        const now = new Date()
        const ageInMonths = (now.getFullYear() - birthDate.getFullYear()) * 12 +
            (now.getMonth() - birthDate.getMonth())
        const years = Math.floor(ageInMonths / 12)
        const months = ageInMonths % 12

        if (years > 0) {
            return `${years} tahun ${months} bulan`
        }
        return `${months} bulan`
    }

    const getGrowthStatus = (analysis?: { weightForAge?: { status?: string }; heightForAge?: { status?: string } }) => {
        if (!analysis) return 'Tidak tersedia'

        const weightStatus = analysis.weightForAge?.status || 'normal'
        const heightStatus = analysis.heightForAge?.status || 'normal'

        if (weightStatus === 'alert' || heightStatus === 'alert') {
            return 'Perlu Perhatian'
        } else if (weightStatus === 'warning' || heightStatus === 'warning') {
            return 'Pantau'
        }
        return 'Normal'
    }

    const getImmunizationStatus = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'Selesai'
            case 'SCHEDULED': return 'Terjadwal'
            case 'OVERDUE': return 'Terlambat'
            case 'SKIPPED': return 'Dilewati'
            default: return 'Tidak diketahui'
        }
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: printStyles }} />

            <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 overflow-hidden">
                {/* Print Button - Hidden in print mode */}
                <div className="no-print bg-gradient-to-r from-picton-blue to-berkeley-blue p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Preview Laporan</h3>
                            <p className="text-blue-100 text-sm">Klik tombol cetak untuk mencetak laporan ini</p>
                        </div>
                        <button
                            onClick={handlePrint}
                            className="px-6 py-3 bg-white text-picton-blue rounded-xl hover:bg-blue-50 transition-colors font-medium flex items-center gap-2 shadow-soft"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Cetak Laporan
                        </button>
                    </div>
                </div>

                <div id="print-content" className="print-container p-6 lg:p-8">

                    {/* Header */}
                    <div className="print-header">
                        <div className="print-title">{getReportTitle()}</div>
                        {options?.clinicName && (
                            <div className="print-subtitle">{options.clinicName}</div>
                        )}
                        {options?.doctorName && (
                            <div className="print-subtitle">Dr. {options.doctorName}</div>
                        )}
                        <div className="text-sm mt-2">
                            Dibuat pada: {format(new Date(), 'dd MMMM yyyy, HH:mm', { locale: id })}
                        </div>
                    </div>

                    {/* Child Information */}
                    {renderChildInfo()}

                    {/* Report Content Based on Type */}
                    {(reportType === 'comprehensive' || reportType === 'growth') && renderGrowthData()}

                    {(reportType === 'comprehensive' || reportType === 'immunization') && renderImmunizationData()}

                    {reportType === 'comprehensive' && renderMPASIData()}

                    {/* Charts Section - Only if not in print mode and charts are included */}
                    {options?.includeCharts && !isPrintMode && (
                        <div className="print-section no-print">
                            <h2 className="print-section-title">Grafik dan Visualisasi</h2>
                            <p className="text-gray-600 italic">
                                Grafik akan ditampilkan saat mencetak atau mengekspor ke PDF.
                            </p>
                        </div>
                    )}

                    {/* Recommendations Section */}
                    <div className="print-section avoid-break">
                        <h2 className="print-section-title">Rekomendasi</h2>
                        <div className="space-y-2">
                            <p>1. Lakukan pemeriksaan pertumbuhan rutin setiap bulan</p>
                            <p>2. Pastikan asupan gizi seimbang sesuai usia anak</p>
                            <p>3. Ikuti jadwal imunisasi yang telah ditetapkan</p>
                            <p>4. Konsultasikan dengan dokter anak jika ada kekhawatiran</p>
                            <p>5. Pantau perkembangan anak secara berkala</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="print-footer">
                        <div>
                            Laporan dibuat oleh BayiCare - Aplikasi Pantau Tumbuh Kembang Anak
                        </div>
                        <div className="text-xs mt-1">
                            Untuk informasi lebih lanjut, konsultasikan dengan tenaga medis profesional
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}