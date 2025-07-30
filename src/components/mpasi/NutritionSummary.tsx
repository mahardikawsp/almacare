'use client'

import { useState, useEffect } from 'react'
import { Child, NutritionSummary as NutritionSummaryType } from '@/types'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, TrendingUp, Target, AlertCircle } from 'lucide-react'

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
        { key: 'calories', label: 'Kalori', unit: 'kkal' },
        { key: 'protein', label: 'Protein', unit: 'g' },
        { key: 'fat', label: 'Lemak', unit: 'g' },
        { key: 'carbohydrates', label: 'Karbohidrat', unit: 'g' }
    ]

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
                                            <h3 className="text-lg font-semibold text-neutral-900">
                                                {item.label}
                                            </h3>
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