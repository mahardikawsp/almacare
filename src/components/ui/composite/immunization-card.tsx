'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Shield, CheckCircle, Clock, AlertTriangle, Calendar, Plus } from 'lucide-react'
// Define types locally to avoid import issues
interface ImmunizationCalendarItem {
    id: string
    vaccineName: string
    vaccineType: string
    scheduledDate: Date
    actualDate?: Date
    status: string
    notes?: string
    isOptional: boolean
    isOverdue: boolean
    description?: string
    daysUntilDue?: number
}
import { format, differenceInDays } from 'date-fns'
import { id } from 'date-fns/locale'

interface ImmunizationCardProps extends React.HTMLAttributes<HTMLDivElement> {
    child: {
        id: string
        name: string
        birthDate: Date
    }
    stats: {
        total: number
        completed: number
        scheduled: number
        overdue: number
    }
    upcomingImmunizations: ImmunizationCalendarItem[]
    onViewSchedule?: () => void
    onAddRecord?: () => void
    onViewDetails?: (immunizationId: string) => void
    isLoading?: boolean
}

const ImmunizationCard = React.forwardRef<HTMLDivElement, ImmunizationCardProps>(
    ({
        className,
        child,
        stats,
        upcomingImmunizations,
        onViewSchedule,
        onAddRecord,
        onViewDetails,
        isLoading = false,
        ...props
    }, ref) => {
        const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

        const getStatusIcon = (status: string) => {
            switch (status.toLowerCase()) {
                case 'completed':
                    return <CheckCircle className="w-4 h-4 text-green-600" />
                case 'scheduled':
                    return <Clock className="w-4 h-4 text-blue-600" />
                case 'overdue':
                    return <AlertTriangle className="w-4 h-4 text-red-600" />
                default:
                    return <Clock className="w-4 h-4 text-gray-600" />
            }
        }

        const getStatusColor = (status: string) => {
            switch (status.toLowerCase()) {
                case 'completed':
                    return 'text-green-700 bg-green-50 border-green-200'
                case 'scheduled':
                    return 'text-blue-700 bg-blue-50 border-blue-200'
                case 'overdue':
                    return 'text-red-700 bg-red-50 border-red-200'
                default:
                    return 'text-gray-700 bg-gray-50 border-gray-200'
            }
        }

        const getUrgencyLevel = (item: ImmunizationCalendarItem) => {
            if (item.status === 'OVERDUE') return 'overdue'
            if (item.daysUntilDue && item.daysUntilDue <= 7) return 'urgent'
            if (item.daysUntilDue && item.daysUntilDue <= 30) return 'upcoming'
            return 'scheduled'
        }

        const formatDaysUntilDue = (item: ImmunizationCalendarItem) => {
            if (item.status === 'OVERDUE') {
                const daysOverdue = Math.abs(differenceInDays(new Date(), item.scheduledDate))
                return `Terlambat ${daysOverdue} hari`
            }
            if (item.daysUntilDue === 0) return 'Hari ini'
            if (item.daysUntilDue === 1) return 'Besok'
            if (item.daysUntilDue && item.daysUntilDue <= 7) return `${item.daysUntilDue} hari lagi`
            return format(item.scheduledDate, 'dd MMM yyyy', { locale: id })
        }

        if (isLoading) {
            return (
                <Card ref={ref} className={cn("animate-pulse", className)} {...props}>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                                <div>
                                    <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-16 bg-gray-200 rounded-lg"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    </CardContent>
                </Card>
            )
        }

        return (
            <Card
                ref={ref}
                className={cn(
                    "hover:shadow-soft-lg transition-all duration-200 min-h-touch",
                    className
                )}
                variant="interactive"
                {...props}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Jadwal Imunisasi</CardTitle>
                                <CardDescription>
                                    {child.name} • {completionPercentage}% selesai
                                </CardDescription>
                            </div>
                        </div>
                        {stats.overdue > 0 && (
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{stats.overdue}</span>
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Progress Imunisasi
                            </span>
                            <span className="text-sm font-semibold text-picton-blue">
                                {stats.completed}/{stats.total}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Status Summary */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-green-50 rounded-lg p-2">
                            <div className="text-lg font-bold text-green-700">{stats.completed}</div>
                            <div className="text-xs text-green-600">Selesai</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-2">
                            <div className="text-lg font-bold text-blue-700">{stats.scheduled}</div>
                            <div className="text-xs text-blue-600">Terjadwal</div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2">
                            <div className="text-lg font-bold text-red-700">{stats.overdue}</div>
                            <div className="text-xs text-red-600">Terlambat</div>
                        </div>
                    </div>

                    {/* Upcoming Immunizations */}
                    {upcomingImmunizations.length > 0 ? (
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                                Imunisasi Mendatang
                            </h4>
                            <div className="space-y-2">
                                {upcomingImmunizations.slice(0, 2).map((item) => {
                                    const urgency = getUrgencyLevel(item)
                                    return (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors min-h-touch",
                                                getStatusColor(item.status)
                                            )}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onViewDetails?.(item.id)
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                {getStatusIcon(item.status)}
                                                <div>
                                                    <div className="font-medium text-sm">{item.vaccineName}</div>
                                                    <div className="text-xs text-gray-600">
                                                        {formatDaysUntilDue(item)}
                                                    </div>
                                                </div>
                                            </div>
                                            {urgency === 'overdue' && (
                                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                            {upcomingImmunizations.length > 2 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onViewSchedule?.()
                                    }}
                                    className="w-full mt-2 text-picton-blue hover:text-picton-blue/80"
                                >
                                    Lihat {upcomingImmunizations.length - 2} lainnya
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                                Semua imunisasi terjadwal telah selesai
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                                onViewSchedule?.()
                            }}
                            className="flex-1 min-h-touch"
                            size="sm"
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Lihat Jadwal
                        </Button>
                        <Button
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation()
                                onAddRecord?.()
                            }}
                            className="min-h-touch"
                            size="sm"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Alert for Overdue */}
                    {stats.overdue > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-red-900 mb-1">
                                        Perhatian: Ada imunisasi yang terlambat
                                    </p>
                                    <p className="text-red-700">
                                        Segera konsultasikan dengan dokter untuk jadwal imunisasi yang tertunda.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        )
    }
)

ImmunizationCard.displayName = 'ImmunizationCard'

export { ImmunizationCard }