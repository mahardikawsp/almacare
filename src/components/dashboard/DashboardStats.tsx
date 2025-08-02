'use client'

import { useEffect, useState } from 'react'
import { useChildStore } from '@/stores/childStore'
import { useGrowthStore } from '@/stores/growthStore'
import { ChildIcon } from '@/components/icons/ChildIcon'
import { GrowthIcon } from '@/components/icons/GrowthIcon'
import { ImmunizationIcon } from '@/components/icons/ImmunizationIcon'

interface DashboardStatsProps {
    onChildrenCountUpdate?: (count: number) => void
}

export function DashboardStats({ onChildrenCountUpdate }: DashboardStatsProps) {
    const { children } = useChildStore()
    const { growthRecords } = useGrowthStore()
    const [immunizationStats, setImmunizationStats] = useState({ completed: 0, total: 0 })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        onChildrenCountUpdate?.(children.length)
    }, [children.length, onChildrenCountUpdate])

    useEffect(() => {
        const fetchImmunizationStats = async () => {
            if (children.length === 0) {
                setImmunizationStats({ completed: 0, total: 0 })
                setIsLoading(false)
                return
            }

            try {
                let totalCompleted = 0
                let totalRecords = 0

                for (const child of children) {
                    const response = await fetch(`/api/immunization/${child.id}/records`)
                    if (response.ok) {
                        const data = await response.json()
                        const records = data.records || []
                        totalRecords += records.length
                        totalCompleted += records.filter((r: { status: string }) => r.status === 'COMPLETED').length
                    }
                }

                setImmunizationStats({ completed: totalCompleted, total: totalRecords })
            } catch (error) {
                console.error('Error fetching immunization stats:', error)
                setImmunizationStats({ completed: 0, total: 0 })
            } finally {
                setIsLoading(false)
            }
        }

        fetchImmunizationStats()
    }, [children])

    const stats = [
        {
            icon: ChildIcon,
            value: children.length,
            label: 'Anak Terdaftar',
            color: 'primary',
            bgColor: 'bg-primary-100',
            textColor: 'text-primary-500'
        },
        {
            icon: GrowthIcon,
            value: growthRecords.length,
            label: 'Catatan Pertumbuhan',
            color: 'secondary',
            bgColor: 'bg-secondary-100',
            textColor: 'text-secondary-500'
        },
        {
            icon: ImmunizationIcon,
            value: isLoading ? '...' : immunizationStats.completed,
            label: 'Imunisasi Selesai',
            color: 'accent',
            bgColor: 'bg-accent-100',
            textColor: 'text-accent-500'
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                    <div
                        key={index}
                        className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                    >
                        {/* Background decoration */}
                        <div className={`absolute top-0 right-0 w-20 h-20 ${stat.bgColor} opacity-10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300`}></div>

                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                <IconComponent className={`w-7 h-7 ${stat.textColor}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-2xl font-bold text-gray-900 truncate mb-1">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-gray-600 font-medium leading-tight">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}