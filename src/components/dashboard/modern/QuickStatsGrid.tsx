'use client'

import { motion } from 'framer-motion'

interface QuickStatsGridProps {
    className?: string
}

interface StatItem {
    id: string
    label: string
    value: string
    icon: string
    color: string
    bgColor: string
    trend?: 'up' | 'down' | 'stable'
    trendValue?: string
}

export function QuickStatsGrid({ className = '' }: QuickStatsGridProps) {
    const stats: StatItem[] = [
        {
            id: 'weight',
            label: 'Weight',
            value: '7.2kg',
            icon: '⚖️',
            color: 'blue',
            bgColor: 'bg-blue-50',
            trend: 'up',
            trendValue: '+0.3kg'
        },
        {
            id: 'height',
            label: 'Height',
            value: '68cm',
            icon: '📏',
            color: 'green',
            bgColor: 'bg-green-50',
            trend: 'up',
            trendValue: '+2cm'
        },
        {
            id: 'sleep',
            label: 'Sleep',
            value: '12h',
            icon: '😴',
            color: 'purple',
            bgColor: 'bg-purple-50',
            trend: 'stable',
            trendValue: 'avg'
        },
        {
            id: 'feeding',
            label: 'Feeding',
            value: '8x',
            icon: '🍼',
            color: 'orange',
            bgColor: 'bg-orange-50',
            trend: 'up',
            trendValue: '+1'
        }
    ]

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

    return (
        <div className={`grid grid-cols-2 gap-3 ${className}`}>
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${stat.bgColor} rounded-2xl p-4 border border-opacity-20 hover:scale-105 transition-all duration-300 cursor-pointer`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl">{stat.icon}</div>
                        {stat.trend && (
                            <div className="flex items-center gap-1">
                                {getTrendIcon(stat.trend)}
                                {stat.trendValue && (
                                    <span className="text-xs text-gray-600 font-medium">
                                        {stat.trendValue}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="text-xl font-bold text-gray-900 mb-1">
                        {stat.value}
                    </div>

                    <div className="text-sm text-gray-600 font-medium">
                        {stat.label}
                    </div>
                </motion.div>
            ))}
        </div>
    )
}