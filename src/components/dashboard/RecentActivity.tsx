'use client'

import { useEffect, useState } from 'react'
import { useChildStore } from '@/stores/childStore'
import { useGrowthStore } from '@/stores/growthStore'
import { GrowthIcon } from '@/components/icons/GrowthIcon'
import { ImmunizationIcon } from '@/components/icons/ImmunizationIcon'
import { MPASIIcon } from '@/components/icons/MPASIIcon'

interface ActivityItem {
    id: string
    type: 'growth' | 'immunization' | 'mpasi'
    title: string
    description: string
    date: Date
    childName: string
    childId: string
}

export function RecentActivity() {
    const { children } = useChildStore()
    const { growthRecords } = useGrowthStore()
    const [activities, setActivities] = useState<ActivityItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchRecentActivities = async () => {
            if (children.length === 0) {
                setActivities([])
                setIsLoading(false)
                return
            }

            try {
                const allActivities: ActivityItem[] = []

                // Add growth records
                growthRecords.forEach(record => {
                    const child = children.find(c => c.id === record.childId)
                    if (child) {
                        allActivities.push({
                            id: `growth-${record.id}`,
                            type: 'growth',
                            title: 'Data Pertumbuhan Ditambahkan',
                            description: `BB: ${record.weight}kg, TB: ${record.height}cm`,
                            date: new Date(record.date),
                            childName: child.name,
                            childId: child.id
                        })
                    }
                })

                // Fetch recent immunizations for all children
                for (const child of children) {
                    try {
                        const response = await fetch(`/api/immunization/${child.id}/records`)
                        if (response.ok) {
                            const data = await response.json()
                            const completedRecords = data.records?.filter(
                                (record: { status: string; actualDate: string | null }) => record.status === 'COMPLETED' && record.actualDate
                            ) || []

                            completedRecords.forEach((record: { id: string; actualDate: string; schedule: { vaccineName: string } }) => {
                                allActivities.push({
                                    id: `immunization-${record.id}`,
                                    type: 'immunization',
                                    title: 'Imunisasi Selesai',
                                    description: record.schedule.vaccineName,
                                    date: new Date(record.actualDate),
                                    childName: child.name,
                                    childId: child.id
                                })
                            })
                        }
                    } catch (error) {
                        console.error(`Error fetching immunizations for ${child.name}:`, error)
                    }
                }

                // Sort by date (most recent first) and take top 10
                const sortedActivities = allActivities
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .slice(0, 10)

                setActivities(sortedActivities)
            } catch (error) {
                console.error('Error fetching recent activities:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchRecentActivities()
    }, [children, growthRecords])

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'growth':
                return <GrowthIcon className="w-5 h-5 text-secondary-500" />
            case 'immunization':
                return <ImmunizationIcon className="w-5 h-5 text-accent-500" />
            case 'mpasi':
                return <MPASIIcon className="w-5 h-5 text-primary-500" />
            default:
                return null
        }
    }

    const getActivityBgColor = (type: string) => {
        switch (type) {
            case 'growth':
                return 'bg-secondary-100'
            case 'immunization':
                return 'bg-accent-100'
            case 'mpasi':
                return 'bg-primary-100'
            default:
                return 'bg-neutral-100'
        }
    }

    const formatRelativeTime = (date: Date) => {
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) return 'Baru saja'
        if (diffInHours < 24) return `${diffInHours} jam yang lalu`

        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 7) return `${diffInDays} hari yang lalu`

        const diffInWeeks = Math.floor(diffInDays / 7)
        if (diffInWeeks < 4) return `${diffInWeeks} minggu yang lalu`

        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        })
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    Aktivitas Terbaru
                </h3>
                <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="animate-pulse flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Aktivitas Terbaru
            </h3>

            {activities.length === 0 ? (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-neutral-600 text-sm">
                        Belum ada aktivitas terbaru
                    </p>
                    <p className="text-neutral-500 text-xs mt-1">
                        Mulai dengan menambahkan data pertumbuhan atau imunisasi
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-neutral-50 rounded-xl transition-colors">
                            <div className={`w-10 h-10 ${getActivityBgColor(activity.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-medium text-neutral-900 truncate">
                                        {activity.title}
                                    </h4>
                                    <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full flex-shrink-0">
                                        {activity.childName}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-600 truncate">
                                    {activity.description}
                                </p>
                                <p className="text-xs text-neutral-500 mt-1">
                                    {formatRelativeTime(activity.date)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}