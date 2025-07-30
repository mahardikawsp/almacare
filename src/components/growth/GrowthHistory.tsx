'use client'

import { useState, useEffect } from 'react'
import { useChildStore } from '@/stores/childStore'
import { GrowthRecordWithAnalysis } from '@/lib/growth-service'
import { ChartIcon } from '@/components/icons/ChartIcon'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface GrowthHistoryProps {
    onEditRecord?: (record: GrowthRecordWithAnalysis) => void
}

export function GrowthHistory({ onEditRecord }: GrowthHistoryProps) {
    const { selectedChild } = useChildStore()
    const [records, setRecords] = useState<GrowthRecordWithAnalysis[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (selectedChild) {
            fetchGrowthRecords()
        }
    }, [selectedChild]) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchGrowthRecords = async () => {
        if (!selectedChild) return

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/growth?childId=${selectedChild.id}`)
            const result = await response.json()

            if (!result.success) {
                throw new Error(result.error || 'Gagal memuat data pertumbuhan')
            }

            setRecords(result.data || [])
        } catch (error) {
            console.error('Error fetching growth records:', error)
            setError(error instanceof Error ? error.message : 'Terjadi kesalahan')
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusColor = (status: 'normal' | 'warning' | 'alert') => {
        switch (status) {
            case 'normal':
                return 'text-green-600 bg-green-50 border-green-200'
            case 'warning':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200'
            case 'alert':
                return 'text-red-600 bg-red-50 border-red-200'
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200'
        }
    }

    const getStatusText = (status: 'normal' | 'warning' | 'alert') => {
        switch (status) {
            case 'normal':
                return 'Normal'
            case 'warning':
                return 'Perhatian'
            case 'alert':
                return 'Waspada'
            default:
                return 'Unknown'
        }
    }

    const formatDate = (date: Date) => {
        return format(new Date(date), 'dd MMM yyyy', { locale: id })
    }

    const calculateAge = (birthDate: Date, measurementDate: Date) => {
        const birth = new Date(birthDate)
        const measurement = new Date(measurementDate)

        const ageInMonths = Math.floor(
            (measurement.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
        )

        if (ageInMonths < 12) {
            return `${ageInMonths} bulan`
        } else {
            const years = Math.floor(ageInMonths / 12)
            const months = ageInMonths % 12
            return months > 0 ? `${years} tahun ${months} bulan` : `${years} tahun`
        }
    }

    if (!selectedChild) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                    Pilih anak terlebih dahulu untuk melihat riwayat pertumbuhan.
                </p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
                <button
                    onClick={fetchGrowthRecords}
                    className="mt-2 text-red-600 hover:text-red-800 font-medium"
                >
                    Coba lagi
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ChartIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Riwayat Pertumbuhan
                        </h2>
                        <p className="text-sm text-gray-600">
                            {selectedChild.name} • {records.length} pengukuran
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {records.length === 0 ? (
                    <div className="text-center py-8">
                        <ChartIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">Belum ada data pertumbuhan</p>
                        <p className="text-sm text-gray-400">
                            Tambahkan pengukuran pertama untuk memulai pemantauan pertumbuhan
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {records.map((record) => (
                            <div
                                key={record.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-gray-900">
                                                {formatDate(record.date)}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                ({calculateAge(selectedChild.birthDate, record.date)})
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Usia: {record.ageInMonths} bulan
                                        </p>
                                    </div>

                                    {onEditRecord && (
                                        <button
                                            onClick={() => onEditRecord(record)}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Weight */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">Berat Badan</span>
                                            <span className="text-lg font-semibold text-gray-900">
                                                {record.weight} kg
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Z-Score</span>
                                            <span className="text-sm font-medium">
                                                {record.analysis.weightForAge.zScore.toFixed(1)}
                                            </span>
                                        </div>
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.analysis.weightForAge.status)}`}>
                                            {getStatusText(record.analysis.weightForAge.status)}
                                        </div>
                                    </div>

                                    {/* Height */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">Tinggi Badan</span>
                                            <span className="text-lg font-semibold text-gray-900">
                                                {record.height} cm
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Z-Score</span>
                                            <span className="text-sm font-medium">
                                                {record.analysis.heightForAge.zScore.toFixed(1)}
                                            </span>
                                        </div>
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.analysis.heightForAge.status)}`}>
                                            {getStatusText(record.analysis.heightForAge.status)}
                                        </div>
                                    </div>

                                    {/* Head Circumference */}
                                    {record.headCircumference && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700">Lingkar Kepala</span>
                                                <span className="text-lg font-semibold text-gray-900">
                                                    {record.headCircumference} cm
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500">Z-Score</span>
                                                <span className="text-sm font-medium">
                                                    {record.analysis.headCircumferenceForAge?.zScore.toFixed(1) || 'N/A'}
                                                </span>
                                            </div>
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.analysis.headCircumferenceForAge?.status || 'normal')}`}>
                                                {getStatusText(record.analysis.headCircumferenceForAge?.status || 'normal')}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Weight for Height Status */}
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">
                                            Status Gizi (BB/TB)
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">
                                                Z-Score: {record.analysis.weightForHeight.zScore.toFixed(1)}
                                            </span>
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.analysis.weightForHeight.status)}`}>
                                                {getStatusText(record.analysis.weightForHeight.status)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}