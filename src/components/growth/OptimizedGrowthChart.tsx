'use client'

import { memo, useMemo, useCallback } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { usePerformanceMonitor, MemoryOptimizer } from '../../lib/performance-monitor'
import { Card } from '../ui/Card'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface GrowthRecord {
    id: string
    date: string
    weight: number
    height: number
    weightForAgeZScore: number
    heightForAgeZScore: number
}

interface OptimizedGrowthChartProps {
    data: GrowthRecord[]
    childName: string
    metric: 'weight' | 'height' | 'weightForAgeZScore' | 'heightForAgeZScore'
    className?: string
}

// Memoized chart component to prevent unnecessary re-renders
export const OptimizedGrowthChart = memo(function OptimizedGrowthChart({
    data,
    childName,
    metric,
    className = ''
}: OptimizedGrowthChartProps) {
    const { startTiming, endTiming } = usePerformanceMonitor('OptimizedGrowthChart')

    // Memoized chart data processing
    const chartData = useMemo(() => {
        startTiming('data-processing')

        const processedData = data
            .slice(-20) // Only show last 20 points for performance
            .map(record => ({
                date: new Date(record.date).toLocaleDateString('id-ID', {
                    month: 'short',
                    day: 'numeric'
                }),
                value: record[metric],
                fullDate: record.date
            }))
            .reverse() // Show chronological order

        endTiming('data-processing')
        return processedData
    }, [data, metric, startTiming, endTiming])

    // Memoized chart configuration
    const chartConfig = useMemo(() => {
        const configs = {
            weight: {
                label: 'Berat Badan (kg)',
                color: '#3B82F6',
                unit: 'kg'
            },
            height: {
                label: 'Tinggi Badan (cm)',
                color: '#10B981',
                unit: 'cm'
            },
            weightForAgeZScore: {
                label: 'Z-Score Berat/Usia',
                color: '#F59E0B',
                unit: ''
            },
            heightForAgeZScore: {
                label: 'Z-Score Tinggi/Usia',
                color: '#EF4444',
                unit: ''
            }
        }
        return configs[metric]
    }, [metric])

    // Memoized tooltip formatter
    const tooltipFormatter = useCallback((value: number, name: string) => [
        `${value.toFixed(1)}${chartConfig.unit}`,
        chartConfig.label
    ], [chartConfig])

    // Throttled resize handler
    const handleResize = useMemo(
        () => MemoryOptimizer.throttle(() => {
            // Handle chart resize if needed
        }, 100),
        []
    )

    if (!data || data.length === 0) {
        return (
            <Card className={`p-6 ${className}`}>
                <div className="text-center text-gray-500">
                    <p>Belum ada data pertumbuhan untuk {childName}</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className={`p-6 ${className}`}>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    {chartConfig.label} - {childName}
                </h3>
                <p className="text-sm text-gray-600">
                    Menampilkan {chartData.length} data terakhir
                </p>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        onResize={handleResize}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                            dataKey="date"
                            stroke="#6B7280"
                            fontSize={12}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            stroke="#6B7280"
                            fontSize={12}
                            tick={{ fontSize: 12 }}
                            domain={['dataMin - 0.5', 'dataMax + 0.5']}
                        />
                        <Tooltip
                            formatter={tooltipFormatter}
                            labelStyle={{ color: '#374151' }}
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={chartConfig.color}
                            strokeWidth={2}
                            dot={{ fill: chartConfig.color, strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: chartConfig.color, strokeWidth: 2 }}
                            connectNulls={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Performance indicator in development */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-2 text-xs text-gray-400">
                    Chart rendered with {chartData.length} data points
                </div>
            )}
        </Card>
    )
})

// Higher-order component for additional optimizations
export function withChartOptimization<T extends object>(
    Component: React.ComponentType<T>
) {
    return memo(function OptimizedComponent(props: T) {
        const { detectMemoryLeaks } = usePerformanceMonitor('ChartWrapper')

        // Check for memory leaks periodically
        if (typeof window !== 'undefined') {
            setTimeout(detectMemoryLeaks, 10000)
        }

        return <Component {...props} />
    })
}

export default OptimizedGrowthChart