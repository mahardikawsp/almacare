'use client'

import { useState, useEffect } from 'react'
import { useChildStore } from '@/stores/childStore'
import { GrowthRecordWithAnalysis } from '@/lib/growth-service'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Legend,
    Area,
    AreaChart
} from 'recharts'
import { ChartIcon } from '@/components/icons/ChartIcon'
import { format } from 'date-fns'

interface ChartDataPoint {
    date: string
    ageInMonths: number
    weight?: number
    height?: number
    headCircumference?: number
    weightZScore?: number
    heightZScore?: number
    weightHeightZScore?: number
    headCircumferenceZScore?: number
    weightStatus?: string
    heightStatus?: string
    weightHeightStatus?: string
    headCircumferenceStatus?: string
}

type ChartType = 'weight' | 'height' | 'weightHeight' | 'headCircumference'

export function GrowthCharts() {
    const { selectedChild } = useChildStore()
    const [records, setRecords] = useState<GrowthRecordWithAnalysis[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeChart, setActiveChart] = useState<ChartType>('weight')

    useEffect(() => {
        if (selectedChild) {
            fetchGrowthRecords()
        }
    }, [selectedChild]) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchGrowthRecords = async () => {
        if (!selectedChild) return

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/growth?childId=${selectedChild.id}`)
            const result = await response.json()

            if (!result.success) {
                throw new Error(result.error || 'Gagal memuat data pertumbuhan')
            }

            setRecords(result.data || [])
        } catch (error) {
            console.error('Error fetching growth records:', error)
            setError(error instanceof Error ? error.message : 'Terjadi kesalahan')
        } finally {
            setIsLoading(false)
        }
    }

    const prepareChartData = (): ChartDataPoint[] => {
        return records
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((record) => ({
                date: format(new Date(record.date), 'dd/MM/yy'),
                ageInMonths: record.ageInMonths,
                weight: record.weight,
                height: record.height,
                headCircumference: record.headCircumference || undefined,
                weightZScore: record.analysis.weightForAge.zScore,
                heightZScore: record.analysis.heightForAge.zScore,
                weightHeightZScore: record.analysis.weightForHeight.zScore,
                headCircumferenceZScore: record.analysis.headCircumferenceForAge?.zScore,
                weightStatus: record.analysis.weightForAge.status,
                heightStatus: record.analysis.heightForAge.status,
                weightHeightStatus: record.analysis.weightForHeight.status,
                headCircumferenceStatus: record.analysis.headCircumferenceForAge?.status
            }))
    }

    // Generate WHO percentile reference data for charts
    const generateWHOPercentileData = (type: 'weight' | 'height') => {
        if (!selectedChild || records.length === 0) return []

        const minAge = Math.min(...records.map(r => r.ageInMonths))
        const maxAge = Math.max(...records.map(r => r.ageInMonths))
        const ageRange = []

        for (let age = Math.max(0, minAge - 2); age <= maxAge + 2; age += 0.5) {
            ageRange.push(age)
        }

        // Mock WHO percentile data - in real implementation, this would come from WHO standards
        return ageRange.map(age => {
            const baseValue = type === 'weight' ? 3 + (age * 0.5) : 50 + (age * 2)
            return {
                ageInMonths: age,
                date: `${age}m`,
                p3: baseValue * 0.8,
                p15: baseValue * 0.9,
                p50: baseValue,
                p85: baseValue * 1.1,
                p97: baseValue * 1.2
            }
        })
    }

    const exportChart = async () => {
        try {
            // Use html2canvas to capture the chart
            const html2canvas = (await import('html2canvas')).default
            const element = document.getElementById('growth-chart-container')

            if (element) {
                const canvas = await html2canvas(element, {
                    backgroundColor: '#ffffff',
                    scale: 2
                })

                // Create download link
                const link = document.createElement('a')
                link.download = `grafik-pertumbuhan-${selectedChild.name}-${format(new Date(), 'yyyy-MM-dd')}.png`
                link.href = canvas.toDataURL()
                link.click()
            }
        } catch (error) {
            console.error('Error exporting chart:', error)
            alert('Gagal mengekspor grafik. Silakan coba lagi.')
        }
    }



    const CustomTooltip = ({ active, payload, label }: {
        active?: boolean
        payload?: Array<{
            payload: ChartDataPoint
            color: string
            name: string
            value: number
            dataKey: string
        }>
        label?: string
    }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 mb-2">{label}</p>
                    <p className="text-sm text-gray-600 mb-2">
                        Usia: {data.ageInMonths} bulan
                    </p>
                    {payload.map((entry, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-sm">
                                {entry.name}: {entry.value}
                                {entry.dataKey.includes('ZScore') && (
                                    <span className="ml-1 text-xs text-gray-500">
                                        (Z-Score)
                                    </span>
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            )
        }
        return null
    }

    const renderChart = () => {
        const data = prepareChartData()

        if (data.length === 0) {
            return (
                <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                        <ChartIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p>Belum ada data untuk ditampilkan</p>
                    </div>
                </div>
            )
        }

        switch (activeChart) {
            case 'weight':
                const weightPercentileData = generateWHOPercentileData('weight')
                const combinedWeightData = data.map(d => {
                    const percentile = weightPercentileData.find(p => Math.abs(p.ageInMonths - d.ageInMonths) < 0.5)
                    return { ...d, ...percentile }
                })

                return (
                    <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 300 : 400}>
                        <LineChart data={combinedWeightData} margin={{
                            top: 20,
                            right: window.innerWidth < 768 ? 10 : 30,
                            left: window.innerWidth < 768 ? 10 : 20,
                            bottom: 20
                        }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis
                                dataKey="date"
                                stroke="#6b7280"
                                fontSize={window.innerWidth < 768 ? 10 : 12}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                stroke="#6b7280"
                                fontSize={window.innerWidth < 768 ? 10 : 12}
                                label={{
                                    value: 'Berat (kg)',
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: { textAnchor: 'middle' }
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: window.innerWidth < 768 ? '12px' : '14px' }} />

                            {/* WHO Percentile Lines */}
                            <Line
                                type="monotone"
                                dataKey="p3"
                                stroke="#bfdbfe"
                                strokeWidth={1}
                                dot={false}
                                name="P3"
                                strokeDasharray="2 2"
                            />
                            <Line
                                type="monotone"
                                dataKey="p15"
                                stroke="#93c5fd"
                                strokeWidth={1}
                                dot={false}
                                name="P15"
                                strokeDasharray="2 2"
                            />
                            <Line
                                type="monotone"
                                dataKey="p50"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={false}
                                name="P50 (Median)"
                                strokeDasharray="2 2"
                            />
                            <Line
                                type="monotone"
                                dataKey="p85"
                                stroke="#93c5fd"
                                strokeWidth={1}
                                dot={false}
                                name="P85"
                                strokeDasharray="2 2"
                            />
                            <Line
                                type="monotone"
                                dataKey="p97"
                                stroke="#bfdbfe"
                                strokeWidth={1}
                                dot={false}
                                name="P97"
                                strokeDasharray="2 2"
                            />

                            {/* Child's actual weight */}
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="#ef4444"
                                strokeWidth={3}
                                dot={{ fill: '#ef4444', strokeWidth: 2, r: window.innerWidth < 768 ? 3 : 5 }}
                                name="Berat Badan Anak"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )

            case 'height':
                const heightPercentileData = generateWHOPercentileData('height')
                const combinedHeightData = data.map(d => {
                    const percentile = heightPercentileData.find(p => Math.abs(p.ageInMonths - d.ageInMonths) < 0.5)
                    return { ...d, ...percentile }
                })

                return (
                    <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 300 : 400}>
                        <LineChart data={combinedHeightData} margin={{
                            top: 20,
                            right: window.innerWidth < 768 ? 10 : 30,
                            left: window.innerWidth < 768 ? 10 : 20,
                            bottom: 20
                        }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis
                                dataKey="date"
                                stroke="#6b7280"
                                fontSize={window.innerWidth < 768 ? 10 : 12}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                stroke="#6b7280"
                                fontSize={window.innerWidth < 768 ? 10 : 12}
                                label={{
                                    value: 'Tinggi (cm)',
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: { textAnchor: 'middle' }
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: window.innerWidth < 768 ? '12px' : '14px' }} />

                            {/* WHO Percentile Lines */}
                            <Line
                                type="monotone"
                                dataKey="p3"
                                stroke="#bbf7d0"
                                strokeWidth={1}
                                dot={false}
                                name="P3"
                                strokeDasharray="2 2"
                            />
                            <Line
                                type="monotone"
                                dataKey="p15"
                                stroke="#86efac"
                                strokeWidth={1}
                                dot={false}
                                name="P15"
                                strokeDasharray="2 2"
                            />
                            <Line
                                type="monotone"
                                dataKey="p50"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={false}
                                name="P50 (Median)"
                                strokeDasharray="2 2"
                            />
                            <Line
                                type="monotone"
                                dataKey="p85"
                                stroke="#86efac"
                                strokeWidth={1}
                                dot={false}
                                name="P85"
                                strokeDasharray="2 2"
                            />
                            <Line
                                type="monotone"
                                dataKey="p97"
                                stroke="#bbf7d0"
                                strokeWidth={1}
                                dot={false}
                                name="P97"
                                strokeDasharray="2 2"
                            />

                            {/* Child's actual height */}
                            <Line
                                type="monotone"
                                dataKey="height"
                                stroke="#dc2626"
                                strokeWidth={3}
                                dot={{ fill: '#dc2626', strokeWidth: 2, r: window.innerWidth < 768 ? 3 : 5 }}
                                name="Tinggi Badan Anak"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )

            case 'weightHeight':
                return (
                    <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 300 : 400}>
                        <LineChart data={data} margin={{
                            top: 20,
                            right: window.innerWidth < 768 ? 10 : 30,
                            left: window.innerWidth < 768 ? 10 : 20,
                            bottom: 20
                        }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis
                                dataKey="date"
                                stroke="#6b7280"
                                fontSize={window.innerWidth < 768 ? 10 : 12}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                stroke="#6b7280"
                                fontSize={window.innerWidth < 768 ? 10 : 12}
                                label={{
                                    value: 'Z-Score',
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: { textAnchor: 'middle' }
                                }}
                                domain={[-4, 4]}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: window.innerWidth < 768 ? '12px' : '14px' }} />

                            {/* Reference lines for Z-scores */}
                            <ReferenceLine y={0} stroke="#10b981" strokeWidth={2} strokeDasharray="2 2" label="Normal" />
                            <ReferenceLine y={-2} stroke="#f59e0b" strokeWidth={1} strokeDasharray="2 2" label="-2 SD" />
                            <ReferenceLine y={2} stroke="#f59e0b" strokeWidth={1} strokeDasharray="2 2" label="+2 SD" />
                            <ReferenceLine y={-3} stroke="#ef4444" strokeWidth={1} strokeDasharray="2 2" label="-3 SD" />
                            <ReferenceLine y={3} stroke="#ef4444" strokeWidth={1} strokeDasharray="2 2" label="+3 SD" />

                            {/* Normal zone area */}
                            <Area
                                type="monotone"
                                dataKey={() => 2}
                                fill="#10b981"
                                fillOpacity={0.1}
                                stroke="none"
                            />

                            <Line
                                type="monotone"
                                dataKey="weightHeightZScore"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: window.innerWidth < 768 ? 3 : 5 }}
                                name="BB/TB Z-Score"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )

            case 'headCircumference':
                const hasHeadCircumferenceData = data.some(d => d.headCircumference)

                if (!hasHeadCircumferenceData) {
                    return (
                        <div className="h-64 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <ChartIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                <p>Belum ada data lingkar kepala</p>
                            </div>
                        </div>
                    )
                }

                return (
                    <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 300 : 400}>
                        <LineChart data={data} margin={{
                            top: 20,
                            right: window.innerWidth < 768 ? 10 : 30,
                            left: window.innerWidth < 768 ? 10 : 20,
                            bottom: 20
                        }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis
                                dataKey="date"
                                stroke="#6b7280"
                                fontSize={window.innerWidth < 768 ? 10 : 12}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                stroke="#6b7280"
                                fontSize={window.innerWidth < 768 ? 10 : 12}
                                label={{
                                    value: 'Lingkar Kepala (cm)',
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: { textAnchor: 'middle' }
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: window.innerWidth < 768 ? '12px' : '14px' }} />

                            <Line
                                type="monotone"
                                dataKey="headCircumference"
                                stroke="#f59e0b"
                                strokeWidth={3}
                                dot={{ fill: '#f59e0b', strokeWidth: 2, r: window.innerWidth < 768 ? 3 : 5 }}
                                name="Lingkar Kepala (cm)"
                                connectNulls={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )

            default:
                return null
        }
    }

    const chartTabs = [
        { key: 'weight', label: 'Berat Badan', color: 'bg-blue-100 text-blue-700' },
        { key: 'height', label: 'Tinggi Badan', color: 'bg-green-100 text-green-700' },
        { key: 'weightHeight', label: 'Status Gizi', color: 'bg-purple-100 text-purple-700' },
        { key: 'headCircumference', label: 'Lingkar Kepala', color: 'bg-yellow-100 text-yellow-700' }
    ]

    if (!selectedChild) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                    Pilih anak terlebih dahulu untuk melihat grafik pertumbuhan.
                </p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
                <button
                    onClick={fetchGrowthRecords}
                    className="mt-2 text-red-600 hover:text-red-800 font-medium"
                >
                    Coba lagi
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-soft border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <ChartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Grafik Pertumbuhan
                            </h2>
                            <p className="text-sm text-gray-600">
                                {selectedChild.name} • {records.length} data pengukuran
                            </p>
                        </div>
                    </div>

                    {/* Export Button */}
                    <div className="sm:ml-auto">
                        <button
                            onClick={() => exportChart()}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="hidden sm:inline">Ekspor</span>
                        </button>
                    </div>
                </div>

                {/* Chart Tabs */}
                <div className="flex flex-wrap gap-2">
                    {chartTabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveChart(tab.key as ChartType)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeChart === tab.key
                                ? tab.color
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 sm:p-6">
                <div id="growth-chart-container">
                    {renderChart()}
                </div>

                {/* Chart Legend */}
                {activeChart === 'weightHeight' && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Panduan Z-Score:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span>Normal: -2 hingga +2 SD</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span>Perhatian: -3 hingga -2 atau +2 hingga +3 SD</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span>Waspada: &lt; -3 atau &gt; +3 SD</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* WHO Percentile Information */}
                {(activeChart === 'weight' || activeChart === 'height') && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Kurva Pertumbuhan WHO:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-800">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-1 bg-blue-300"></div>
                                <span>Persentil 3 (P3)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-1 bg-blue-400"></div>
                                <span>Persentil 15 (P15)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-1 bg-blue-500"></div>
                                <span>Persentil 50 (P50) - Median</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-1 bg-blue-400"></div>
                                <span>Persentil 85 (P85)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-1 bg-blue-300"></div>
                                <span>Persentil 97 (P97)</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}