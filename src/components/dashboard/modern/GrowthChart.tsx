'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface Child {
    id: string
    name: string
    birthDate: Date
}

interface GrowthChartProps {
    child?: Child
}

interface GrowthData {
    month: string
    weight: number
    height: number
    percentile: number
}

export function GrowthChart({ child }: GrowthChartProps) {
    const [growthData, setGrowthData] = useState<GrowthData[]>([])
    const [selectedMetric, setSelectedMetric] = useState<'weight' | 'height'>('weight')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchGrowthData = async () => {
            if (!child) {
                setGrowthData([])
                setIsLoading(false)
                return
            }

            try {
                // Mock growth data - in real app, this would come from API
                const mockData: GrowthData[] = [
                    { month: 'Jan', weight: 3.2, height: 50, percentile: 45 },
                    { month: 'Feb', weight: 4.1, height: 54, percentile: 50 },
                    { month: 'Mar', weight: 5.2, height: 58, percentile: 55 },
                    { month: 'Apr', weight: 6.1, height: 62, percentile: 60 },
                    { month: 'May', weight: 6.8, height: 65, percentile: 65 },
                    { month: 'Jun', weight: 7.4, height: 68, percentile: 70 },
                ]

                setGrowthData(mockData)
            } catch (error) {
                console.error('Error fetching growth data:', error)
                setGrowthData([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchGrowthData()
    }, [child])

    const getMetricData = () => {
        return growthData.map(item => ({
            ...item,
            value: selectedMetric === 'weight' ? item.weight : item.height
        }))
    }

    const getMetricUnit = () => {
        return selectedMetric === 'weight' ? 'kg' : 'cm'
    }

    const getMetricColor = () => {
        return selectedMetric === 'weight' ? '#3B82F6' : '#10B981'
    }

    const getLatestValue = () => {
        if (growthData.length === 0) return null
        const latest = growthData[growthData.length - 1]
        return selectedMetric === 'weight' ? latest.weight : latest.height
    }

    const getGrowthTrend = () => {
        if (growthData.length < 2) return null
        const latest = growthData[growthData.length - 1]
        const previous = growthData[growthData.length - 2]
        const current = selectedMetric === 'weight' ? latest.weight : latest.height
        const prev = selectedMetric === 'weight' ? previous.weight : previous.height
        const change = current - prev
        return {
            value: Math.abs(change),
            direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
        }
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                    <div className="h-48 bg-gray-200 rounded-2xl"></div>
                </div>
            </div>
        )
    }

    if (!child || growthData.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">📈</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">No Growth Data</h3>
                    <p className="text-sm text-gray-600">Start tracking your child's growth</p>
                </div>
            </div>
        )
    }

    const trend = getGrowthTrend()
    const latestValue = getLatestValue()

    return (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Growth Chart</h3>
                    <p className="text-sm text-gray-600 mt-1">Track your child's development</p>
                </div>

                {/* Metric Selector */}
                <div className="flex bg-gray-100 rounded-2xl p-1">
                    <button
                        onClick={() => setSelectedMetric('weight')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${selectedMetric === 'weight'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Weight
                    </button>
                    <button
                        onClick={() => setSelectedMetric('height')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${selectedMetric === 'height'
                                ? 'bg-white text-green-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Height
                    </button>
                </div>
            </div>

            {/* Current Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                        {latestValue}{getMetricUnit()}
                    </div>
                    <div className="text-sm text-gray-600">Current</div>
                </div>

                <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                            {growthData[growthData.length - 1]?.percentile}%
                        </span>
                        {trend && (
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${trend.direction === 'up' ? 'bg-green-100' :
                                    trend.direction === 'down' ? 'bg-red-100' : 'bg-gray-100'
                                }`}>
                                {trend.direction === 'up' && (
                                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                                    </svg>
                                )}
                                {trend.direction === 'down' && (
                                    <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                                    </svg>
                                )}
                                {trend.direction === 'stable' && (
                                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="text-sm text-gray-600">Percentile</div>
                </div>

                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {trend ? `+${trend.value.toFixed(1)}` : '0'}
                    </div>
                    <div className="text-sm text-gray-600">This month</div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getMetricData()}>
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={getMetricColor()} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={getMetricColor()} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={getMetricColor()}
                            strokeWidth={3}
                            fill="url(#colorGradient)"
                            dot={{ fill: getMetricColor(), strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: getMetricColor(), strokeWidth: 2, fill: '#fff' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Status */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-green-900">Healthy Growth</h4>
                        <p className="text-sm text-green-700">
                            {child.name} is growing within normal range
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}