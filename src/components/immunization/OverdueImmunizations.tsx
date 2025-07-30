'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { apiUrls } from '@/lib/swr-config'
import { ImmunizationRecordWithSchedule } from '@/types'
import { format, differenceInDays } from 'date-fns'
import { id } from 'date-fns/locale'

interface OverdueImmunizationsProps {
    childId: string
}

export function OverdueImmunizations({ childId }: OverdueImmunizationsProps) {
    const [updatingRecord, setUpdatingRecord] = useState<string | null>(null)

    const { data, error, isLoading, mutate } = useSWR(
        `${apiUrls.immunizationRecords(childId)}/overdue`,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true
        }
    )

    const overdueRecords: ImmunizationRecordWithSchedule[] = data?.overdue || []

    const markAsCompleted = async (recordId: string) => {
        setUpdatingRecord(recordId)
        try {
            const response = await fetch(`/api/immunization/records/${recordId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'COMPLETED',
                    actualDate: new Date().toISOString()
                })
            })

            if (response.ok) {
                mutate() // Refresh the data
            } else {
                throw new Error('Failed to update record')
            }
        } catch (error) {
            console.error('Error updating immunization record:', error)
            alert('Gagal memperbarui status imunisasi')
        } finally {
            setUpdatingRecord(null)
        }
    }

    const markAsSkipped = async (recordId: string) => {
        if (!confirm('Apakah Anda yakin ingin melewati imunisasi ini?')) {
            return
        }

        setUpdatingRecord(recordId)
        try {
            const response = await fetch(`/api/immunization/records/${recordId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'SKIPPED',
                    notes: 'Dilewati oleh pengguna'
                })
            })

            if (response.ok) {
                mutate() // Refresh the data
            } else {
                throw new Error('Failed to update record')
            }
        } catch (error) {
            console.error('Error updating immunization record:', error)
            alert('Gagal memperbarui status imunisasi')
        } finally {
            setUpdatingRecord(null)
        }
    }

    const getDaysOverdue = (date: string | Date) => {
        const scheduledDate = typeof date === 'string' ? new Date(date) : date
        const today = new Date()
        return differenceInDays(today, scheduledDate)
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="text-center text-red-600">
                    <p>Gagal memuat imunisasi yang terlambat</p>
                    <button
                        onClick={() => mutate()}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                        Coba lagi
                    </button>
                </div>
            </div>
        )
    }

    if (overdueRecords.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-soft text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Tidak Ada Imunisasi Terlambat
                </h3>
                <p className="text-gray-600">
                    Semua imunisasi telah dilakukan sesuai jadwal. Pertahankan!
                </p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    Imunisasi Terlambat
                </h3>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                    {overdueRecords.length} terlambat
                </span>
            </div>

            {/* Warning Alert */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-red-900 mb-1">
                            Perhatian! Ada Imunisasi yang Terlambat
                        </h4>
                        <p className="text-sm text-red-800">
                            Segera konsultasikan dengan dokter atau fasilitas kesehatan terdekat
                            untuk mengejar imunisasi yang tertunda.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {overdueRecords.map((record) => {
                    const daysOverdue = getDaysOverdue(record.scheduledDate)
                    const isUpdating = updatingRecord === record.id

                    return (
                        <div
                            key={record.id}
                            className="border border-red-200 bg-red-50 rounded-lg p-4"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold text-gray-900">
                                            {record.schedule.vaccineName}
                                        </h4>
                                        {record.schedule.isOptional && (
                                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                                Opsional
                                            </span>
                                        )}
                                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                            Terlambat {daysOverdue} hari
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-2">
                                        {record.schedule.vaccineType}
                                    </p>

                                    {record.schedule.description && (
                                        <p className="text-xs text-gray-500 mb-3">
                                            {record.schedule.description}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-gray-600">
                                                Dijadwalkan: {format(new Date(record.scheduledDate), 'dd MMM yyyy', { locale: id })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => markAsCompleted(record.id)}
                                        disabled={isUpdating}
                                        className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isUpdating ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span className="hidden sm:inline">Menyimpan...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="hidden sm:inline">Selesai</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => markAsSkipped(record.id)}
                                        disabled={isUpdating}
                                        className="bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                                        </svg>
                                        <span className="hidden sm:inline">Lewati</span>
                                    </button>
                                </div>
                            </div>

                            {/* Priority indicator for critical vaccines */}
                            {!record.schedule.isOptional && daysOverdue > 30 && (
                                <div className="mt-3 p-2 bg-red-100 rounded-lg">
                                    <div className="flex items-center gap-2 text-red-700">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <span className="text-sm font-medium">
                                            Prioritas Tinggi! Sudah terlambat lebih dari 1 bulan
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Action Recommendations */}
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">🏥 Langkah Selanjutnya</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Hubungi dokter anak atau fasilitas kesehatan terdekat</li>
                    <li>• Bawa buku KIA (Kesehatan Ibu dan Anak) saat konsultasi</li>
                    <li>• Tanyakan jadwal catch-up immunization yang sesuai</li>
                    <li>• Pastikan anak dalam kondisi sehat sebelum imunisasi</li>
                    <li>• Catat tanggal pemberian imunisasi untuk referensi</li>
                </ul>
            </div>

            {/* Emergency Contact Info */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📞 Kontak Darurat</h4>
                <div className="text-sm text-blue-800 space-y-1">
                    <p>• Puskesmas terdekat: Hubungi 119 (Halo Kemkes)</p>
                    <p>• Rumah Sakit: Cek direktori RS di aplikasi atau website Kemenkes</p>
                    <p>• Dokter Spesialis Anak: Konsultasi melalui telemedicine jika tersedia</p>
                </div>
            </div>
        </div>
    )
}