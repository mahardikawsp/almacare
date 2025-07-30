'use client'

import { ZScoreResult } from '@/lib/who-zscore-calculator'

interface GrowthStatusIndicatorProps {
    indicator: ZScoreResult
    label: string
    value: number
    unit: string
    size?: 'sm' | 'md' | 'lg'
    showDetails?: boolean
}

export function GrowthStatusIndicator({
    indicator,
    label,
    value,
    unit,
    size = 'md',
    showDetails = true
}: GrowthStatusIndicatorProps) {
    const getStatusColor = (status: 'normal' | 'warning' | 'alert') => {
        switch (status) {
            case 'normal':
                return {
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    text: 'text-green-800',
                    dot: 'bg-green-500'
                }
            case 'warning':
                return {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200',
                    text: 'text-yellow-800',
                    dot: 'bg-yellow-500'
                }
            case 'alert':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    text: 'text-red-800',
                    dot: 'bg-red-500'
                }
            default:
                return {
                    bg: 'bg-gray-50',
                    border: 'border-gray-200',
                    text: 'text-gray-800',
                    dot: 'bg-gray-500'
                }
        }
    }

    const getStatusText = (status: 'normal' | 'warning' | 'alert') => {
        switch (status) {
            case 'normal':
                return 'Normal'
            case 'warning':
                return 'Perhatian'
            case 'alert':
                return 'Waspada'
            default:
                return 'Unknown'
        }
    }

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return {
                    container: 'p-3',
                    value: 'text-lg',
                    label: 'text-xs',
                    badge: 'text-xs px-2 py-1',
                    zScore: 'text-xs'
                }
            case 'lg':
                return {
                    container: 'p-6',
                    value: 'text-3xl',
                    label: 'text-base',
                    badge: 'text-sm px-3 py-1.5',
                    zScore: 'text-sm'
                }
            default:
                return {
                    container: 'p-4',
                    value: 'text-2xl',
                    label: 'text-sm',
                    badge: 'text-xs px-2.5 py-1',
                    zScore: 'text-sm'
                }
        }
    }

    const colors = getStatusColor(indicator.status)
    const sizeClasses = getSizeClasses()

    return (
        <div className={`bg-white rounded-lg border ${colors.border} ${sizeClasses.container}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <span className={`font-medium text-gray-700 ${sizeClasses.label}`}>
                    {label}
                </span>
                <div className={`inline-flex items-center rounded-full font-medium border ${colors.bg} ${colors.border} ${colors.text} ${sizeClasses.badge}`}>
                    <div className={`w-2 h-2 rounded-full mr-1.5 ${colors.dot}`} />
                    {getStatusText(indicator.status)}
                </div>
            </div>

            {/* Value */}
            <div className={`font-bold text-gray-900 ${sizeClasses.value} mb-1`}>
                {value} {unit}
            </div>

            {/* Z-Score and Details */}
            {showDetails && (
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <span className={`text-gray-500 ${sizeClasses.zScore}`}>
                            Z-Score
                        </span>
                        <span className={`font-medium ${sizeClasses.zScore}`}>
                            {indicator.zScore.toFixed(1)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className={`text-gray-500 ${sizeClasses.zScore}`}>
                            Persentil
                        </span>
                        <span className={`font-medium ${sizeClasses.zScore}`}>
                            {indicator.percentile.toFixed(1)}%
                        </span>
                    </div>

                    {size !== 'sm' && (
                        <div className={`text-gray-600 mt-2 ${sizeClasses.zScore}`}>
                            {indicator.message}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

interface GrowthStatusGridProps {
    weightForAge?: ZScoreResult
    heightForAge?: ZScoreResult
    weightForHeight?: ZScoreResult
    headCircumferenceForAge?: ZScoreResult
    measurements: {
        weight: number
        height: number
        headCircumference?: number
    }
    size?: 'sm' | 'md' | 'lg'
}

export function GrowthStatusGrid({
    weightForAge,
    heightForAge,
    weightForHeight,
    headCircumferenceForAge,
    measurements,
    size = 'md'
}: GrowthStatusGridProps) {
    const indicators = [
        {
            key: 'weight',
            indicator: weightForAge,
            label: 'Berat Badan',
            value: measurements.weight,
            unit: 'kg'
        },
        {
            key: 'height',
            indicator: heightForAge,
            label: 'Tinggi Badan',
            value: measurements.height,
            unit: 'cm'
        },
        {
            key: 'weightHeight',
            indicator: weightForHeight,
            label: 'Status Gizi (BB/TB)',
            value: measurements.weight,
            unit: 'kg'
        }
    ]

    // Add head circumference if available
    if (headCircumferenceForAge && measurements.headCircumference) {
        indicators.push({
            key: 'headCircumference',
            indicator: headCircumferenceForAge,
            label: 'Lingkar Kepala',
            value: measurements.headCircumference,
            unit: 'cm'
        })
    }

    const getGridCols = () => {
        const count = indicators.length
        if (count === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        if (count === 3) return 'grid-cols-1 md:grid-cols-3'
        return 'grid-cols-1 md:grid-cols-2'
    }

    return (
        <div className={`grid gap-4 ${getGridCols()}`}>
            {indicators.map(({ key, indicator, label, value, unit }) => (
                indicator && (
                    <GrowthStatusIndicator
                        key={key}
                        indicator={indicator}
                        label={label}
                        value={value}
                        unit={unit}
                        size={size}
                    />
                )
            ))}
        </div>
    )
}