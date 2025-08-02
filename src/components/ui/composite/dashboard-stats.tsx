'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatItem {
    id: string
    label: string
    value: string | number
    change?: {
        value: number
        type: 'increase' | 'decrease' | 'neutral'
        period: string
    }
    icon?: LucideIcon
    color?: string
    bgColor?: string
    description?: string
}

interface DashboardStatsProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string
    description?: string
    stats: StatItem[]
    columns?: 1 | 2 | 3 | 4
    onStatClick?: (statId: string) => void
    isLoading?: boolean
}

const DashboardStats = React.forwardRef<HTMLDivElement, DashboardStatsProps>(
    ({
        className,
        title,
        description,
        stats,
        columns = 2,
        onStatClick,
        isLoading = false,
        ...props
    }, ref) => {
        const getTrendIcon = (type: 'increase' | 'decrease' | 'neutral') => {
            switch (type) {
                case 'increase':
                    return <TrendingUp className="w-3 h-3 text-green-600" />
                case 'decrease':
                    return <TrendingDown className="w-3 h-3 text-red-600" />
                default:
                    return <Minus className="w-3 h-3 text-gray-600" />
            }
        }

        const getTrendColor = (type: 'increase' | 'decrease' | 'neutral') => {
            switch (type) {
                case 'increase':
                    return 'text-green-600'
                case 'decrease':
                    return 'text-red-600'
                default:
                    return 'text-gray-600'
            }
        }

        const getGridColumns = () => {
            switch (columns) {
                case 1:
                    return 'grid-cols-1'
                case 2:
                    return 'grid-cols-1 sm:grid-cols-2'
                case 3:
                    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                case 4:
                    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                default:
                    return 'grid-cols-1 sm:grid-cols-2'
            }
        }

        if (isLoading) {
            return (
                <Card ref={ref} className={cn("animate-pulse", className)} {...props}>
                    {(title || description) && (
                        <CardHeader className="pb-3">
                            {title && <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>}
                            {description && <div className="h-4 bg-gray-200 rounded w-64"></div>}
                        </CardHeader>
                    )}
                    <CardContent>
                        <div className={cn("grid gap-4", getGridColumns())}>
                            {Array.from({ length: stats.length || 4 }).map((_, i) => (
                                <div key={i} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="h-8 bg-gray-200 rounded mb-1"></div>
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )
        }

        return (
            <Card ref={ref} className={cn("", className)} {...props}>
                {(title || description) && (
                    <CardHeader className="pb-3">
                        {title && <CardTitle className="text-lg">{title}</CardTitle>}
                        {description && <CardDescription>{description}</CardDescription>}
                    </CardHeader>
                )}

                <CardContent>
                    <div className={cn("grid gap-4", getGridColumns())}>
                        {stats.map((stat) => {
                            const StatIcon = stat.icon
                            const isClickable = onStatClick && !isLoading

                            return (
                                <div
                                    key={stat.id}
                                    className={cn(
                                        "bg-alice-blue/50 rounded-lg p-4 transition-all duration-200",
                                        "min-h-touch", // Ensure touch-friendly height
                                        isClickable && [
                                            "cursor-pointer hover:bg-alice-blue hover:shadow-sm",
                                            "active:scale-[0.98] touch:active:scale-[0.98]",
                                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-picton-blue focus-visible:ring-offset-2"
                                        ]
                                    )}
                                    role={isClickable ? "button" : undefined}
                                    tabIndex={isClickable ? 0 : undefined}
                                    onClick={() => isClickable && onStatClick(stat.id)}
                                    onKeyDown={(e) => {
                                        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                                            e.preventDefault()
                                            onStatClick(stat.id)
                                        }
                                    }}
                                >
                                    {/* Header with icon and trend */}
                                    <div className="flex items-center justify-between mb-3">
                                        {StatIcon && (
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                                stat.bgColor || "bg-picton-blue/10"
                                            )}>
                                                <StatIcon className={cn(
                                                    "w-4 h-4",
                                                    stat.color || "text-picton-blue"
                                                )} />
                                            </div>
                                        )}

                                        {stat.change && (
                                            <div className={cn(
                                                "flex items-center gap-1 text-xs font-medium",
                                                getTrendColor(stat.change.type)
                                            )}>
                                                {getTrendIcon(stat.change.type)}
                                                <span>{Math.abs(stat.change.value)}%</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Value */}
                                    <div className="mb-1">
                                        <div className="text-2xl font-bold text-berkeley-blue">
                                            {stat.value}
                                        </div>
                                    </div>

                                    {/* Label and description */}
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 mb-1">
                                            {stat.label}
                                        </div>

                                        {stat.description && (
                                            <div className="text-xs text-gray-600 line-clamp-2">
                                                {stat.description}
                                            </div>
                                        )}

                                        {stat.change && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                {stat.change.period}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        )
    }
)

DashboardStats.displayName = 'DashboardStats'

export { DashboardStats, type StatItem }