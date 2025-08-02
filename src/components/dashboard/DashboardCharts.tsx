'use client'

import { memo } from 'react'
import { usePerformanceMonitor } from '../../lib/performance-monitor'
import { Card } from '../ui/Card'

interface DashboardChartsProps {
    childId: string
    data: any[]
}

// Memoized component to prevent unnecessary re-renders
export const DashboardCharts = memo(function DashboardCharts({
    childId,
    data
}: DashboardChartsProps) {
    const { startTiming, endTiming } = usePerformanceMonitor('DashboardCharts')

    // Simulate chart rendering timing
    startTiming('render')

    // Chart rendering logic would go here
    const chartData = data.slice(-10) // Only show last 10 data points for performance

    endTiming('render')

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Growth Charts</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chart for child {childId} with {chartData.length} data points</p>
            </div>
        </Card>
    )
})

export default DashboardCharts