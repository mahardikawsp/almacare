'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { apiUrls } from '@/lib/swr-config'
import { ImmunizationCalendarItem } from '@/types'
import { getImmunizationStatusColor } from '@/lib/theme'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns'
import { id } from 'date-fns/locale'

interface ImmunizationCalendarProps {
    childId: string
}

export function ImmunizationCalendar({ childId }: ImmunizationCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1

    const { data, error, isLoading } = useSWR(
        `${apiUrls.immunizationCalendar(childId)}?year=${year}&month=${month}`,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true
        }
    )

    const calendarItems: ImmunizationCalendarItem[] = data?.calendar || []

    // Get calendar days
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Get immunizations for a specific date
    const getImmunizationsForDate = (date: Date) => {
        return calendarItems.filter(item =>
            isSameDay(new Date(item.scheduledDate), date)
        )
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate)
        if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1)
        } else {
            newDate.setMonth(newDate.getMonth() + 1)
        }
        setCurrentDate(newDate)
        setSelectedDate(null)
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 35 }).map((_, i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded"></div>
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
                    <p>Gagal memuat kalender imunisasi</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                        Coba lagi
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigateMonth('prev')}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <h2 className="text-xl font-semibold">
                        {format(currentDate, 'MMMM yyyy', { locale: id })}
                    </h2>

                    <button
                        onClick={() => navigateMonth('next')}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="p-6">
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day) => {
                        const immunizations = getImmunizationsForDate(day)
                        const hasImmunizations = immunizations.length > 0
                        const isSelected = selectedDate && isSameDay(day, selectedDate)
                        const isCurrentMonth = isSameMonth(day, currentDate)

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => setSelectedDate(isSelected ? null : day)}
                                className={`
                                    relative h-12 rounded-lg border transition-all
                                    ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                                    ${isSelected ? 'bg-blue-100 border-blue-500' : 'border-gray-200 hover:bg-gray-50'}
                                    ${hasImmunizations ? 'font-semibold' : ''}
                                `}
                            >
                                <span className="text-sm">{format(day, 'd')}</span>

                                {/* Immunization indicators */}
                                {hasImmunizations && (
                                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                                        {immunizations.slice(0, 3).map((item, index) => (
                                            <div
                                                key={index}
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: getImmunizationStatusColor(item.status).color }}
                                            />
                                        ))}
                                        {immunizations.length > 3 && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                        )}
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Selected date details */}
                {selectedDate && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3">
                            {format(selectedDate, 'dd MMMM yyyy', { locale: id })}
                        </h3>

                        {getImmunizationsForDate(selectedDate).length === 0 ? (
                            <p className="text-gray-500 text-sm">Tidak ada jadwal imunisasi</p>
                        ) : (
                            <div className="space-y-3">
                                {getImmunizationsForDate(selectedDate).map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 bg-white rounded-lg border"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium text-gray-900">
                                                    {item.vaccineName}
                                                </h4>
                                                <span
                                                    className="px-2 py-1 rounded-full text-xs font-medium"
                                                    style={{
                                                        backgroundColor: getImmunizationStatusColor(item.status).bgColor,
                                                        color: getImmunizationStatusColor(item.status).color
                                                    }}
                                                >
                                                    {item.status === 'COMPLETED' ? 'Selesai' :
                                                        item.status === 'OVERDUE' ? 'Terlambat' :
                                                            item.status === 'SCHEDULED' ? 'Terjadwal' : 'Dilewati'}
                                                </span>
                                                {item.isOptional && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                        Opsional
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{item.vaccineType}</p>
                                            {item.description && (
                                                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                            )}
                                            {item.actualDate && (
                                                <p className="text-xs text-green-600 mt-1">
                                                    Diberikan: {format(new Date(item.actualDate), 'dd MMM yyyy', { locale: id })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Legend */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Keterangan Status</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Selesai</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>Terjadwal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span>Terlambat</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                            <span>Dilewati</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}