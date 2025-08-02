'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useChildStore } from '@/stores/childStore'

interface StatCard {
    id: string
    title: string
    value: string | number
    subtitle: string
    icon: string
    color: string
    bgColor: string
    trend?: 'up' | 'down' | 'stable'
    trendValue?: string
}

export function ModernStats() {
    const { children } = useChildStore()
    const [stats, setStats] = useState<StatCard[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Mock stats data - in real app, this would come from API
                const mockStats: StatCard[] = [
                    {
                        id: 'achievements',
                        title: 'Achievements',
                        value: 12,
                        subtitle: 'Milestones reached',
                        icon: '🏆',
                        color: 'yellow',
                        bgColor: 'bg-yellow-50',
                        trend: 'up',
                        trendValue: '+3 this week'
                    },
                    {
                        id: 'reviews',
                        title: 'Reviews',
                        value: 'Mr. Alexander',
                        subtitle: 'Reviewed',
                        icon: '⭐',
                        color: 'blue',
                        bgColor: 'bg-blue-50',
                        trend: 'stable'
                    }
                ]

                setStats(mockStats)
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [children])

    const getTrendIcon = (trend?: string) => {
        switch (trend) {
            case 'up':
                return (
                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                )
            case 'down':
                return (
                    <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                    </svg>
                )
            case 'stable':
                return (
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                )
            default:
                return null
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                    <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center text-2xl`}>
                            {stat.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 text-sm">
                                    {stat.title}
                                </h4>
                                {stat.trend && getTrendIcon(stat.trend)}
                            </div>

                            <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold text-gray-900">
                                    {stat.value}
                                </span>
                                {stat.trendValue && (
                                    <span className="text-xs text-green-600 font-medium">
                                        {stat.trendValue}
                                    </span>
                                )}
                            </div>

                            <p className="text-xs text-gray-600 mt-1">
                                {stat.subtitle}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* Additional Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-4 border border-orange-100"
            >
                <div className="text-center">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <span className="text-2xl">📊</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Weekly Summary</h4>
                    <p className="text-xs text-gray-600 mb-3">
                        Your child is developing well this week
                    </p>
                    <div className="bg-white bg-opacity-50 rounded-lg p-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold text-gray-900">85%</span>
                        </div>
                        <div className="mt-1 bg-white rounded-full h-2">
                            <div className="bg-gradient-to-r from-orange-400 to-pink-400 h-2 rounded-full w-[85%]"></div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}