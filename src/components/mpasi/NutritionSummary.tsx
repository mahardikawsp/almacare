'use client'

import { useState, useEffect } from 'react'
import { Child, NutritionSummary as NutritionSummaryType } from '@/types'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, TrendingUp, Target, AlertCircle } from 'lucide-react'
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
    RadialBarChart,
    RadialBar
} from 'recharts'
import { format } from 'date-fns'

interface NutritionSummaryProps {
    selectedChild: Child
    selectedDate: Date
    onDateChange: (date: Date) => void
}

export function NutritionSummary({
    selectedChild,
    selectedDate,
    onDateChange
}: NutritionSummaryProps) {
    const [nutritionData, setNutritionData] = useState<NutritionSummaryType | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchNutritionSummary()
    }, [selectedChild.id, selectedDate])

    const fetchNutritionSummary = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                `/api/mpasi/menu-plans/nutrition?childId=${selectedChild.id}&date=${selectedDate.toISOString()}`
            )
            const data = await response.json()
            setNutritionData(data)
        } catch (error) {
            console.error('Error fetching nutrition summary:', error)
        } finally {
            setLoading(false)
        }
    }

    const navigateDate = (direction: 'prev' | 'next') => {
        const newDate = new Date(selectedDate)
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
        onDateChange(newDate)
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getStatusColor = (percentage: number) => {
        if (percentage < 70) return 'text-red-600 bg-red-50'
        if (percentage < 90) return 'text-yellow-600 bg-yellow-50'
        if (percentage <= 110) return 'text-green-600 bg-green-50'
        return 'text-orange-600 bg-orange-50'
    }

    const getStatusIcon = (percentage: number) => {
        if (percentage < 70) return <AlertCircle className="w-4 h-4" />
        if (percentage < 90) return <TrendingUp className="w-4 h-4" />
        if (percentage <= 110) return <Target className="w-4 h-4" />
        return <AlertCircle className="w-4 h-4" />
    }

    const getStatusText = (percentage: number) => {
        if (percentage < 70) return 'Kurang'
        if (percentage < 90) return 'Perlu Ditingkatkan'
        if (percentage <= 110) return 'Optimal'
        return 'Berlebih'
    }

    const nutritionItems = [
        { key: 'calories', label: 'Kalori', unit: 'kkal', color: '#3b82f6' },
        { key: 'protein', label: 'Protein', unit: 'g', color: '#10b981' },
        { key: 'fat', label: 'Lemak', unit: 'g', color: '#f59e0b' },
        { key: 'carbohydrates', label: 'Karbohidrat', unit: 'g', color: '#8b5cf6' }
    ]

    const prepareChartData = () => {
        if (!nutritionData) return []

        return nutritionItems.map(item => ({
            name: item.label,
            value: nutritionData.daily[item.key as keyof typeof nutritionData.daily] as number,
            target: nutritionData.recommended[item.key as keyof typeof nutritionData.recommended] as number,
            percentage: nutritionData.percentage[item.key as keyof typeof nutritionData.percentage],
            color: item.color,
            unit: item.unit
        }))
    }

    const prepareRadialData = () => {
        if (!nutritionData) return []

        return nutritionItems.map((item, index) => ({
            name: item.label,
            percentage: nutritionData.percentage[item.key as keyof typeof nutritionData.percentage],
            fill: item.color
        }))
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 mb-1">{data.name}</p>
                    <p className="text-sm text-gray-600">
                        Konsumsi: {data.value} {data.unit}
                    </p>
                    <p className="text-sm text-gray-600">
                        Target: {data.target} {data.unit}
                    </p>
                    <p className="text-sm font-medium" style={{ color: data.color }}>
                        Progress: {data.percentage}%
                    </p>
                </div>
            )
        }
        return null
    }

    const exportNutritionChart = async () => {
        try {
            const html2canvas = (await import('html2canvas')).default
            const element = document.getElementById('nutrition-chart-container')

            if (element) {
                const canvas = await html2canvas(element, {
                    backgroundColor: '#ffffff',
                    scale: 2
                })

                const link = document.createElement('a')
                link.download = `nutrisi-${selectedChild.name}-${format(selectedDate, 'yyyy-MM-dd')}.png`
                link.href = canvas.toDataURL()
                link.click()
            }
        } catch (error) {
            console.error('Error exporting nutrition chart:', error)
            alert('Gagal mengekspor grafik nutrisi. Silakan coba lagi.')
        }
    }

    return (
        <div className="space-y-6">
            {/* Date Navigation */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateDate('prev')}
                        className="p-2"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-neutral-900">
                            Ringkasan Nutrisi
                        </h2>
                        <p className="text-neutral-600">{formatDate(selectedDate)}</p>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateDate('next')}
                        className="p-2"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Nutrition Summary */}
            {loading ? (
                <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="text-neutral-600 mt-4">Memuat ringkasan nutrisi...</p>
                </div>
            ) : nutritionData ? (
                <div className="space-y-6">
                    {/* Export Button */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={exportNutritionChart}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="hidden sm:inline">Ekspor Grafik</span>
                        </button>
                    </div>

                    <div id="nutrition-chart-container">
                        {/* Nutrition Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Radial Progress Chart */}
                            <div className="bg-white rounded-2xl shadow-soft p-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                                    Progress Nutrisi Harian
                                </h3>
                                <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 250 : 300}>
                                    <RadialBarChart
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="20%"
                                        outerRadius="80%"
                                        data={prepareRadialData()}
                                    >
                                        <RadialBar
                                            dataKey="percentage"
                                            cornerRadius={10}
                                            fill="#8884d8"
                                        />
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload
                                                    return (
                                                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                                            <p className="font-medium text-gray-900">{data.name}</p>
                                                            <p className="text-sm" style={{ color: data.fill }}>
                                                                Progress: {data.percentage}%
                                                            </p>
                                                        </div>
                                                    )
                                                }
                                                return null
                                            }}
                                        />
                                        <Legend />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Bar Chart Comparison */}
                            <div className="bg-white rounded-2xl shadow-soft p-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                                    Konsumsi vs Target
                                </h3>
                                <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 250 : 300}>
                                    <BarChart data={prepareChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#6b7280"
                                            fontSize={window.innerWidth < 768 ? 10 : 12}
                                            angle={window.innerWidth < 768 ? -45 : 0}
                                            textAnchor={window.innerWidth < 768 ? 'end' : 'middle'}
                                            height={window.innerWidth < 768 ? 60 : 30}
                                        />
                                        <YAxis
                                            stroke="#6b7280"
                                            fontSize={window.innerWidth < 768 ? 10 : 12}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ fontSize: window.innerWidth < 768 ? '12px' : '14px' }} />
                                        <Bar dataKey="value" fill="#3b82f6" name="Konsumsi" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="target" fill="#e5e7eb" name="Target" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Pie Chart Distribution */}
                        <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
                            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                                Distribusi Nutrisi Harian
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 250 : 300}>
                                    <PieChart>
                                        <Pie
                                            data={prepareChartData()}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={window.innerWidth < 768 ? 80 : 100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                                            labelLine={false}
                                        >
                                            {prepareChartData().map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="flex flex-col justify-center space-y-4">
                                    {prepareChartData().map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="font-medium text-gray-900">{item.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-gray-900">
                                                    {item.value} {item.unit}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {item.percentage}% dari target
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Nutrition Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {nutritionItems.map((item) => {
                            const daily = nutritionData.daily[item.key as keyof typeof nutritionData.daily] as number
                            const recommended = nutritionData.recommended[item.key as keyof typeof nutritionData.recommended] as number
                            const percentage = nutritionData.percentage[item.key as keyof typeof nutritionData.percentage]

                            return (
                                <div key={item.key} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <h3 className="text-lg font-semibold text-neutral-900">
                                                    {item.label}
                                                </h3>
                                            </div>
                                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(percentage)}`}>
                                                {getStatusIcon(percentage)}
                                                {getStatusText(percentage)}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-neutral-600">Konsumsi Hari Ini</span>
                                                <span className="font-semibold text-neutral-900">
                                                    {daily} {item.unit}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-neutral-600">Target Harian</span>
                                                <span className="font-semibold text-neutral-900">
                                                    {recommended} {item.unit}
                                                </span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-neutral-600">Progress</span>
                                                    <span className="text-sm font-medium text-neutral-900">
                                                        {percentage}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-300 ${percentage < 70 ? 'bg-red-500' :
                                                            percentage < 90 ? 'bg-yellow-500' :
                                                                percentage <= 110 ? 'bg-green-500' :
                                                                    'bg-orange-500'
                                                            }`}
                                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white rounded-2xl shadow-soft p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                            Rekomendasi Nutrisi
                        </h3>
                        <div className="space-y-3">
                            {nutritionItems.map((item) => {
                                const percentage = nutritionData.percentage[item.key as keyof typeof nutritionData.percentage]
                                let recommendation = ''

                                if (percentage < 70) {
                                    recommendation = `${item.label} masih kurang. Tambahkan makanan yang kaya ${item.label.toLowerCase()}.`
                                } else if (percentage < 90) {
                                    recommendation = `${item.label} perlu ditingkatkan sedikit untuk mencapai target optimal.`
                                } else if (percentage <= 110) {
                                    recommendation = `${item.label} sudah optimal. Pertahankan pola makan ini.`
                                } else {
                                    recommendation = `${item.label} berlebih. Kurangi makanan yang tinggi ${item.label.toLowerCase()}.`
                                }

                                return (
                                    <div key={item.key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className={`p-1 rounded-full ${getStatusColor(percentage)}`}>
                                            {getStatusIcon(percentage)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-neutral-900 mb-1">
                                                {item.label}
                                            </div>
                                            <div className="text-sm text-neutral-600">
                                                {recommendation}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
                    <Target className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        Belum Ada Data Nutrisi
                    </h3>
                    <p className="text-neutral-600">
                        Tambahkan menu makanan untuk melihat ringkasan nutrisi harian
                    </p>
                </div>
            )}
        </div>
    )
}