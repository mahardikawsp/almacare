'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, Activity, Calendar, Download } from 'lucide-react'
// Import types - using a more flexible type to avoid import issues
interface GrowthRecordWithAnalysis {
    id: string
    childId: string
    date: Date | string
    weight: number
    height: number
    headCircumference?: number
    ageInMonths: number
    analysis: {
        weightForAge: {
            indicator: string
            zScore: number
            status: string
            message: string
        }
        heightForAge: {
            indicator: string
            zScore: number
            status: string
            message: string
        }
        weightForHeight: {
            indicator: string
            zScore: number
            status: string
            message: string
        }
        headCircumferenceForAge?: {
            indicator: string
            zScore: number
            status: string
            message: string
        }
    }
}
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface GrowthChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
    child: {
        id: string
        name: string
        gender: 'MALE' | 'FEMALE'
        birthDate: Date
    }
    latestRecord?: GrowthRecordWithAnalysis
    recordCount: number
    onViewChart?: () => void
    onAddRecord?: () => void
    onExportData?: () => void
    isLoading?: boolean
}

const GrowthChartCard = React.forwardRef<HTMLDivElement, GrowthChartCardProps>(
    ({
        className,
        child,
        latestRecord,
        recordCount,
        onViewChart,
        onAddRecord,
        onExportData,
        isLoading = false,
        ...props
    }, ref) => {
        const getStatusColor = (status: string) => {
            switch (status.toLowerCase()) {
                case 'normal':
                    return 'text-green-600 bg-green-50'
                case 'warning':
                    return 'text-yellow-600 bg-yellow-50'
                case 'alert':
                    return 'text-red-600 bg-red-50'
                default:
                    return 'text-gray-600 bg-gray-50'
            }
        }

        const getTrendIcon = (current?: number, previous?: number) => {
            if (!current || !previous) return <Minus className="w-4 h-4" />
            if (current > previous) return <TrendingUp className="w-4 h-4 text-green-600" />
            if (current < previous) return <TrendingDown className="w-4 h-4 text-red-600" />
            return <Minus className="w-4 h-4 text-gray-600" />
        }

        const formatStatus = (status: string) => {
            switch (status.toLowerCase()) {
                case 'normal':
                    return 'Normal'
                case 'warning':
                    return 'Perlu Perhatian'
                case 'alert':
                    return 'Perlu Konsultasi'
                default:
                    return status
            }
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
                            <div className="h-8 bg-gray-200 rounded w-20"></div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-16 bg-gray-200 rounded-lg"></div>
                                <div className="h-16 bg-gray-200 rounded-lg"></div>
                            </div>
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
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                <Activity className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Grafik Pertumbuhan</CardTitle>
                                <CardDescription>
                                    {child.name} • {recordCount} pengukuran
                                </CardDescription>
                            </div>
                        </div>
                        {onExportData && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onExportData()
                                }}
                                className="min-w-touch min-h-touch"
                                aria-label="Ekspor data pertumbuhan"
                            >
                                <Download className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {latestRecord ? (
                        <>
                            {/* Latest Measurements */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-alice-blue rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-600">Berat Badan</span>
                                        {getTrendIcon(latestRecord.weight, undefined)}
                                    </div>
                                    <div className="text-lg font-semibold text-berkeley-blue">
                                        {latestRecord.weight} kg
                                    </div>
                                    <div className={cn(
                                        "text-xs px-2 py-1 rounded-full inline-block mt-1",
                                        getStatusColor(latestRecord.analysis.weightForAge.status)
                                    )}>
                                        {formatStatus(latestRecord.analysis.weightForAge.status)}
                                    </div>
                                </div>

                                <div className="bg-alice-blue rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-600">Tinggi Badan</span>
                                        {getTrendIcon(latestRecord.height, undefined)}
                                    </div>
                                    <div className="text-lg font-semibold text-berkeley-blue">
                                        {latestRecord.height} cm
                                    </div>
                                    <div className={cn(
                                        "text-xs px-2 py-1 rounded-full inline-block mt-1",
                                        getStatusColor(latestRecord.analysis.heightForAge.status)
                                    )}>
                                        {formatStatus(latestRecord.analysis.heightForAge.status)}
                                    </div>
                                </div>
                            </div>

                            {/* Last Measurement Date */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    Terakhir diukur: {format(new Date(latestRecord.date), 'dd MMMM yyyy', { locale: id })}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onViewChart?.()
                                    }}
                                    className="flex-1 min-h-touch"
                                    size="sm"
                                >
                                    Lihat Grafik
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
                                    Tambah Data
                                </Button>
                            </div>
                        </>
                    ) : (
                        /* No Data State */
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Activity className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="font-medium text-gray-900 mb-2">
                                Belum Ada Data Pertumbuhan
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Mulai pantau pertumbuhan {child.name} dengan menambahkan data pengukuran pertama
                            </p>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onAddRecord?.()
                                }}
                                className="min-h-touch"
                            >
                                Tambah Data Pertama
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        )
    }
)

GrowthChartCard.displayName = 'GrowthChartCard'

export { GrowthChartCard }