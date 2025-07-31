'use client'

import { useState, useEffect } from 'react'
import { useChildStore } from '@/stores/childStore'
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Area,
    AreaChart
} from 'recharts'
import { format, subDays, startOfWeek } from 'date-fns'
import { id } from 'date-fns/locale'

interface NutritionData {
    date: string
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    calcium: number
    iron: number
}

interface WeeklyNutritionSummary {
    week: string
    avgCalories: number
    avgProtein: number
    avgCarbs: number
    avgFat: number
    totalMeals: number
}

interface NutritionChartsProps {
    childId?: string
}

export function NutritionCharts({ childId }: NutritionChartsProps) {
    const { selectedChild } = useChildStore()
    const [nutritionData, setNutritionData] = useState<NutritionData[]>([])
    const [weeklyData, setWeeklyData] = useState<WeeklyNutritionSummary[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeChart, setActiveChart] = useState<'daily' | 'weekly' | 'distribution'>('daily')
    const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('7days')

    const currentChild = childId ? { id: childId } : selectedChild

    useEffect(() => {
        if (currentChild) {
            fetchNutritionData()
        }
    }, [currentChild, timeRange])

    const fetchNutritionData = async () => {
        if (!currentChild) return

        setIsLoading(true)
        setError(null)

        try {
            // Mock data for demonstration - in real app, this would come from API
            const mockData = generateMockNutritionData()
            setNutritionData(mockData)
            setWeeklyData(generateWeeklyData(mockData))
        } catch (error) {
            console.error('Error fetching nutrition data:', error)
            setError('Gagal memuat data nutrisi')
        } finally {
            setIsLoading(false)
        }
    }

    const generateMockNutritionData = (): NutritionData[] => {
        const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90
        const data: NutritionData[] = []

        for (let i = days - 1; i >= 0; i--) {
            const date = subDays(new Date(), i)
            data.push({
                date: format(date, 'dd/MM'),
                calories: Math.floor(Math.random() * 200) + 400, // 400-600 calories
                protein: Math.floor(Math.random() * 15) + 10, // 10-25g protein
                carbs: Math.floor(Math.random() * 30) + 40, // 40-70g carbs
                fat: Math.floor(Math.random() * 10) + 15, // 15-25g fat
                fiber: Math.floor(Math.random() * 5) + 3, // 3-8g fiber
                calcium: Math.floor(Math.random() * 100) + 200, // 200-300mg calcium
                iron: Math.floor(Math.random() * 3) + 2 // 2-5mg iron
            })
        }

        return data
    }

    const generateWeeklyData = (dailyData: NutritionData[]): WeeklyNutritionSummary[] => {
        const weeks: { [key: string]: NutritionData[] } = {}

        dailyData.forEach(day => {
            const date = new Date(day.date + '/2024')
            const weekStart = startOfWeek(date, { locale: id })
            const weekKey = format(weekStart, 'dd MMM', { locale: id })

            if (!weeks[weekKey]) {
                weeks[weekKey] = []
            }
            weeks[weekKey].push(day)
        })

        return Object.entries(weeks).map(([week, days]) => ({
            week,
            avgCalories: Math.round(days.reduce((sum, day) => sum + day.calories, 0) / days.length),
            avgProtein: Math.round(days.reduce((sum, day) => sum + day.protein, 0) / days.length),
            avgCarbs: Math.round(days.reduce((sum, day) => sum + day.carbs, 0) / days.length),
            avgFat: Math.round(days.reduce((sum, day) => sum + day.fat, 0) / days.length),
            totalMeals: days.length
        }))
    }

    const getNutritionDistribution = () => {
        if (nutritionData.length === 0) return []

        const latest = nutritionData[nutritionData.length - 1]
        const total = latest.protein + latest.carbs + latest.fat

        return [
            { name: 'Protein', value: latest.protein, percentage: Math.round((latest.protein / total) * 100) },
            { name: 'Karbohidrat', value: latest.carbs, percentage: Math.round((latest.carbs / total) * 100) },
            { name: 'Lemak', value: latest.fat, percentage: Math.round((latest.fat / total) * 100) }
        ]
    }

    const exportChart = async () => {
        if (!currentChild) return

        const { ChartExportService, showExportNotification } = await import('@/lib/chart-export')

        ChartExportService.showExportModal('nutrition-chart-container', async (exportFormat, options) => {
            const filename = options.filename || `grafik-nutrisi-${currentChild.id || 'anak'}-${format(new Date(), 'yyyy-MM-dd')}.${exportFormat}`

            let success = false
            if (exportFormat === 'png') {
                success = await ChartExportService.exportAsPNG('nutrition-chart-container', {
                    ...options,
                    filename
                })
            } else {
                success = await ChartExportService.exportAsPDF('nutrition-chart-container', {
                    ...options,
                    filename
                })
            }

            showExportNotification(success, exportFormat)
        })
    }

    const CustomTooltip = ({ active, payload, label }: {
        active?: boolean
        payload?: Array<{ color: string; name: string; value: number; dataKey: string }>
        label?: string
    }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 mb-2">{label}</p>
                    {payload.map((entry, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-sm">
                                {entry.name}: {entry.value}
                                {entry.dataKey === 'calories' ? ' kal' :
                                    entry.dataKey.includes('calcium') || entry.dataKey.includes('iron') ? ' mg' : ' g'}
                            </span>
                        </div>
                    ))}
                </div>
            )
        }
        return null
    }

    const renderChart = () => {
        if (nutritionData.length === 0) {
            return (
                <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p>Belum ada data nutrisi untuk ditampilkan</p>
                    </div>
                </div>
            )
        }

        switch (activeChart) {
            case 'daily':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={nutritionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                            <YAxis stroke="#6b7280" fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="calories"
                                stackId="1"
                                stroke="#ef4444"
                                fill="#ef4444"
                                fillOpacity={0.6}
                                name="Kalori"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )

            case 'weekly':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="week" stroke="#6b7280" fontSize={12} />
                            <YAxis stroke="#6b7280" fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="avgProtein" fill="#10b981" name="Protein (g)" />
                            <Bar dataKey="avgCarbs" fill="#3b82f6" name="Karbohidrat (g)" />
                            <Bar dataKey="avgFat" fill="#f59e0b" name="Lemak (g)" />
                        </BarChart>
                    </ResponsiveContainer>
                )

            case 'distribution':
                const distributionData = getNutritionDistribution()
                const COLORS = ['#10b981', '#3b82f6', '#f59e0b']

                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={distributionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percentage }) => `${name} ${percentage}%`}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {distributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                )

            default:
                return null
        }
    }

    const chartTabs = [
        { key: 'daily', label: 'Harian', color: 'bg-red-100 text-red-700' },
        { key: 'weekly', label: 'Mingguan', color: 'bg-blue-100 text-blue-700' },
        { key: 'distribution', label: 'Distribusi', color: 'bg-green-100 text-green-700' }
    ]

    const timeRangeOptions = [
        { key: '7days', label: '7 Hari' },
        { key: '30days', label: '30 Hari' },
        { key: '90days', label: '90 Hari' }
    ]

    if (!currentChild) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                    Pilih anak terlebih dahulu untuk melihat grafik nutrisi.
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
                    onClick={fetchNutritionData}
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
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Grafik Nutrisi MPASI
                            </h2>
                            <p className="text-sm text-gray-600">
                                Pantau asupan nutrisi harian
                            </p>
                        </div>
                    </div>

                    <div className="sm:ml-auto flex items-center gap-2">
                        {/* Time Range Selector */}
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as '7days' | '30days' | '90days')}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            {timeRangeOptions.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* Export Button */}
                        <button
                            onClick={exportChart}
                            className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
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
                            onClick={() => setActiveChart(tab.key as 'daily' | 'weekly' | 'distribution')}
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
                <div id="nutrition-chart-container">
                    {renderChart()}
                </div>

                {/* Chart Information */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Informasi Grafik:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                        {activeChart === 'daily' && (
                            <>
                                <div>• Grafik menunjukkan asupan kalori harian</div>
                                <div>• Target kalori: 400-600 kal/hari</div>
                                <div>• Data berdasarkan menu MPASI yang dikonsumsi</div>
                            </>
                        )}
                        {activeChart === 'weekly' && (
                            <>
                                <div>• Rata-rata asupan nutrisi per minggu</div>
                                <div>• Protein: 10-25g, Karbohidrat: 40-70g</div>
                                <div>• Lemak: 15-25g per hari</div>
                            </>
                        )}
                        {activeChart === 'distribution' && (
                            <>
                                <div>• Distribusi makronutrien hari ini</div>
                                <div>• Protein: 15-20%, Karbohidrat: 45-65%</div>
                                <div>• Lemak: 20-35% dari total kalori</div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}