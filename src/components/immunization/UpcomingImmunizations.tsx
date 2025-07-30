'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { apiUrls } from '@/lib/swr-config'
import { ImmunizationRecordWithSchedule } from '@/types'
import { format, differenceInDays } from 'date-fns'
import { id } from 'date-fns/locale'

interface UpcomingImmunizationsProps {
    childId: string
}

export function UpcomingImmunizations({ childId }: UpcomingImmunizationsProps) {
    const [updatingRecord, setUpdatingRecord] = useState<string | null>(null)

    const { data, error, isLoading, mutate } = useSWR(
        apiUrls.immunizationUpcoming(childId),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true
        }
    )

    const upcomingRecords: ImmunizationRecordWithSchedule[] = data?.upcoming || []

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

    const getDaysUntil = (date: string | Date) => {
        const targetDate = typeof date === 'string' ? new Date(date) : date
        const today = new Date()
        return differenceInDays(targetDate, today)
    }

    const getUrgencyColor = (daysUntil: number) => {
        if (daysUntil <= 3) return 'bg-red-50 border-red-200'
        if (daysUntil <= 7) return 'bg-orange-50 border-orange-200'
        return 'bg-blue-50 border-blue-200'
    }

    const getUrgencyTextColor = (daysUntil: number) => {
        if (daysUntil <= 3) return 'text-red-700'
        if (daysUntil <= 7) return 'text-orange-700'
        return 'text-blue-700'
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
                    <p>Gagal memuat jadwal imunisasi mendatang</p>
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

    if (upcomingRecords.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-soft text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Tidak Ada Jadwal Mendatang
                </h3>
                <p className="text-gray-600">
                    Tidak ada imunisasi yang dijadwalkan dalam 30 hari ke depan.
                </p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    Imunisasi Mendatang
                </h3>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {upcomingRecords.length} jadwal
                </span>
            </div>

            <div className="space-y-4">
                {upcomingRecords.map((record) => {
                    const daysUntil = getDaysUntil(record.scheduledDate)
                    const isUpdating = updatingRecord === record.id

                    return (
                        <div
                            key={record.id}
                            className={`border rounded-lg p-4 transition-all ${getUrgencyColor(daysUntil)}`}
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
                                                {format(new Date(record.scheduledDate), 'dd MMM yyyy', { locale: id })}
                                            </span>
                                        </div>

                                        <div className={`flex items-center gap-1 ${getUrgencyTextColor(daysUntil)}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="font-medium">
                                                {daysUntil === 0 ? 'Hari ini' :
                                                    daysUntil === 1 ? 'Besok' :
                                                        `${daysUntil} hari lagi`}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => markAsCompleted(record.id)}
                                    disabled={isUpdating}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isUpdating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Menyimpan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Selesai</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Urgency indicator */}
                            {daysUntil <= 3 && (
                                <div className="mt-3 p-2 bg-red-100 rounded-lg">
                                    <div className="flex items-center gap-2 text-red-700">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <span className="text-sm font-medium">
                                            Segera! Jadwal imunisasi sudah dekat
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Siapkan buku KIA (Kesehatan Ibu dan Anak) saat imunisasi</li>
                    <li>• Pastikan anak dalam kondisi sehat sebelum imunisasi</li>
                    <li>• Hubungi fasilitas kesehatan untuk konfirmasi jadwal</li>
                    <li>• Catat reaksi setelah imunisasi jika ada</li>
                </ul>
            </div>
        </div>
    )
}