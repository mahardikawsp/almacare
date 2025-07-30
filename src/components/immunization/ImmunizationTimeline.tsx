'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { apiUrls } from '@/lib/swr-config'
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Timeline,
    LineChart,
    Line,
    ReferenceLine
} from 'recharts'
import { format, differenceInMonths } from 'date-fns'
import { id } from 'date-fns/locale'

interface ImmunizationTimelineProps {
    childId: string
}

interface TimelineData {
    ageInMonths: number
    scheduledVaccines: number
    completedVaccines: number
    overdueVaccines: number
    vaccineNames: string[]
    month: string
}

export function ImmunizationTimeline({ childId }: ImmunizationTimelineProps) {
    const [child, setChild] = useState<any>(null)

    const { data, error, isLoading } = useSWR(
        apiUrls.immunizationRecords(childId),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true
        }
    )

    useEffect(() => {
        // Fetch child data to get birth date
        const fetchChild = async () => {
            try {
                const response = await fetch(`/api/children/${childId}`)
                const result = await response.json()
                if (result.success) {
                    setChild(result.child)
                }
            } catch (error) {
                console.error('Error fetching child:', error)
            }
        }
        fetchChild()
    }, [childId])

    const prepareTimelineData = (): TimelineData[] => {
        if (!data?.records || !child) return []

        const records = data.records
        const birthDate = new Date(child.birthDate)
        const currentDate = new Date()
        const currentAgeInMonths = differenceInMonths(currentDate, birthDate)

        // Group records by age in months
        const groupedData: { [key: number]: any[] } = {}

        records.forEach((record: any) => {
            const scheduledDate = new Date(record.scheduledDate)
            const ageInMonths = differenceInMonths(scheduledDate, birthDate)

            if (!groupedData[ageInMonths]) {
                groupedData[ageInMonths] = []
            }
            groupedData[ageInMonths].push(record)
        })

        // Convert to timeline data
        const timelineData: TimelineData[] = []

        for (let age = 0; age <= Math.max(24, currentAgeInMonths + 6); age++) {
            const vaccinesAtAge = groupedData[age] || []
            const scheduledCount = vaccinesAtAge.length
            const completedCount = vaccinesAtAge.filter(v => v.status === 'COMPLETED').length
            const overdueCount = vaccinesAtAge.filter(v => v.status === 'OVERDUE').length

            if (scheduledCount > 0 || age <= currentAgeInMonths) {
                timelineData.push({
                    ageInMonths: age,
                    scheduledVaccines: scheduledCount,
                    completedVaccines: completedCount,
                    overdueVaccines: overdueCount,
                    vaccineNames: vaccinesAtAge.map(v => v.schedule.vaccineName),
                    month: `${age}m`
                })
            }
        }

        return timelineData
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 mb-2">Usia: {label}</p>
                    <div className="space-y-1">
                        <p className="text-sm text-blue-600">
                            Terjadwal: {data.scheduledVaccines} vaksin
                        </p>
                        <p className="text-sm text-green-600">
                            Selesai: {data.completedVaccines} vaksin
                        </p>
                        <p className="text-sm text-red-600">
                            Terlambat: {data.overdueVaccines} vaksin
                        </p>
                    </div>
                    {data.vaccineNames.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-600 mb-1">Vaksin:</p>
                            <div className="flex flex-wrap gap-1">
                                {data.vaccineNames.map((name: string, index: number) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                    >
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )
        }
        return null
    }

    const exportTimeline = async () => {
        try {
            const html2canvas = (await import('html2canvas')).default
            const element = document.getElementById('immunization-timeline-container')

            if (element) {
                const canvas = await html2canvas(element, {
                    backgroundColor: '#ffffff',
                    scale: 2
                })

                const link = document.createElement('a')
                link.download = `timeline-imunisasi-${child?.name || 'anak'}-${format(new Date(), 'yyyy-MM-dd')}.png`
                link.href = canvas.toDataURL()
                link.click()
            }
        } catch (error) {
            console.error('Error exporting timeline:', error)
            alert('Gagal mengekspor timeline. Silakan coba lagi.')
        }
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-64 bg-gray-100 rounded"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="text-center text-red-600">
                    <p>Gagal memuat timeline imunisasi</p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                        Coba lagi
                    </button>
                </div>
            </div>
        )
    }

    const timelineData = prepareTimelineData()

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-soft overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Timeline Imunisasi
                            </h2>
                            <p className="text-sm text-gray-600">
                                Jadwal dan progress imunisasi berdasarkan usia
                            </p>
                        </div>
                    </div>

                    <div className="sm:ml-auto">
                        <button
                            type="button"
                            onClick={exportTimeline}
                            className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="hidden sm:inline">Ekspor</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6">
                <div id="immunization-timeline-container">
                    {timelineData.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <p>Belum ada data timeline untuk ditampilkan</p>
                            </div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 300 : 400}>
                            <BarChart
                                data={timelineData}
                                margin={{
                                    top: 20,
                                    right: window.innerWidth < 768 ? 10 : 30,
                                    left: window.innerWidth < 768 ? 10 : 20,
                                    bottom: 20
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="month"
                                    stroke="#6b7280"
                                    fontSize={window.innerWidth < 768 ? 10 : 12}
                                    interval={0}
                                    angle={window.innerWidth < 768 ? -45 : 0}
                                    textAnchor={window.innerWidth < 768 ? 'end' : 'middle'}
                                    height={window.innerWidth < 768 ? 60 : 30}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    fontSize={window.innerWidth < 768 ? 10 : 12}
                                    label={{
                                        value: 'Jumlah Vaksin',
                                        angle: -90,
                                        position: 'insideLeft',
                                        style: { textAnchor: 'middle' }
                                    }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: window.innerWidth < 768 ? '12px' : '14px' }} />

                                <Bar
                                    dataKey="completedVaccines"
                                    stackId="vaccines"
                                    fill="#10b981"
                                    name="Selesai"
                                    radius={[0, 0, 0, 0]}
                                />
                                <Bar
                                    dataKey="overdueVaccines"
                                    stackId="vaccines"
                                    fill="#ef4444"
                                    name="Terlambat"
                                    radius={[0, 0, 0, 0]}
                                />
                                <Bar
                                    dataKey="scheduledVaccines"
                                    fill="#3b82f6"
                                    name="Terjadwal"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Timeline Legend */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Keterangan Timeline</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <span>Total Vaksin Terjadwal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span>Vaksin Selesai</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded"></div>
                            <span>Vaksin Terlambat</span>
                        </div>
                    </div>
                </div>

                {/* Key Milestones */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-3">Milestone Imunisasi Penting</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-blue-800">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span>0 bulan: HB-0</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span>2-4 bulan: DPT-HB-Hib series</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span>9 bulan: Campak-Rubella</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span>18 bulan: Booster</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}