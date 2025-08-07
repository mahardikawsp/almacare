'use client'

import { useState, useEffect } from 'react'
import { Child, WeeklyMenuPlan, MealType } from '@/types'
import { MenuPlanningService } from '@/lib/menu-planning-service'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, Sparkles, Calendar } from 'lucide-react'
import { formatNutrition } from '@/lib/mpasi-service'

interface WeeklyMenuViewProps {
    selectedChild: Child
    selectedDate: Date
    onDateChange: (date: Date) => void
}

export function WeeklyMenuView({
    selectedChild,
    selectedDate,
    onDateChange
}: WeeklyMenuViewProps) {
    const [weeklyPlan, setWeeklyPlan] = useState<WeeklyMenuPlan | null>(null)
    const [loading, setLoading] = useState(false)
    const [generating, setGenerating] = useState(false)

    // Get start of week (Monday)
    const getWeekStart = (date: Date) => {
        const d = new Date(date)
        const day = d.getDay()
        const diff = d.getDate() - day + (day === 0 ? -6 : 1)
        return new Date(d.setDate(diff))
    }

    const weekStart = getWeekStart(selectedDate)

    useEffect(() => {
        fetchWeeklyPlan()
    }, [selectedChild.id, weekStart])

    const fetchWeeklyPlan = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                `/api/mpasi/menu-plans?childId=${selectedChild.id}&date=${weekStart.toISOString()}&type=weekly`
            )
            const data = await response.json()
            setWeeklyPlan(data)
        } catch (error) {
            console.error('Error fetching weekly plan:', error)
        } finally {
            setLoading(false)
        }
    }

    const generateWeeklySuggestions = async () => {
        setGenerating(true)
        try {
            const response = await fetch(
                `/api/mpasi/menu-plans/suggestions?childId=${selectedChild.id}&date=${weekStart.toISOString()}&type=weekly`
            )
            const data = await response.json()
            setWeeklyPlan(data)
        } catch (error) {
            console.error('Error generating weekly suggestions:', error)
        } finally {
            setGenerating(false)
        }
    }

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(weekStart)
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
        onDateChange(newDate)
    }

    const formatWeekRange = (start: Date | string, end: Date | string) => {
        const startDate = typeof start === 'string' ? new Date(start) : start
        const endDate = typeof end === 'string' ? new Date(end) : end
        return `${startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
    }

    const mealTypes: MealType[] = ['BREAKFAST', 'SNACK_MORNING', 'LUNCH', 'SNACK_AFTERNOON', 'DINNER']
    const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

    return (
        <div className="space-y-6">
            {/* Week Navigation */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigateWeek('prev')}
                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-neutral-900">
                            Menu Mingguan
                        </h2>
                        <p className="text-neutral-600">
                            {weeklyPlan && formatWeekRange(weeklyPlan.startDate, weeklyPlan.endDate)}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigateWeek('next')}
                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Generate Suggestions Button */}
            <div className="text-center">
                <button
                    type="button"
                    onClick={generateWeeklySuggestions}
                    disabled={generating}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Sparkles className="w-4 h-4" />
                    {generating ? 'Membuat Saran Menu...' : 'Buat Saran Menu Mingguan'}
                </button>
            </div>

            {/* Weekly Menu Grid */}
            {loading ? (
                <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="text-neutral-600 mt-4">Memuat menu mingguan...</p>
                </div>
            ) : weeklyPlan ? (
                <div className="space-y-6">
                    {/* Weekly Overview */}
                    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 text-white">
                            <h3 className="text-lg font-bold">Ringkasan Nutrisi Mingguan</h3>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formatNutrition(weeklyPlan.weeklyNutrition).map((item, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-sm text-neutral-600">{item}</div>
                                        <div className="text-xs text-neutral-500 mt-1">rata-rata/hari</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Daily Menus */}
                    <div className="grid gap-4">
                        {weeklyPlan.days.map((day, dayIndex) => (
                            <div key={dayIndex} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                                <div className="bg-neutral-50 p-4 border-b border-neutral-200">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary-500" />
                                        <h4 className="font-semibold text-neutral-900">
                                            {dayNames[dayIndex]} - {(typeof day.date === 'string' ? new Date(day.date) : day.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </h4>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                        {mealTypes.map((mealType) => {
                                            const meal = day.meals[mealType]
                                            const mealName = MenuPlanningService.getMealTypeDisplayName(mealType)
                                            const mealIcon = MenuPlanningService.getMealTypeIcon(mealType)

                                            return (
                                                <div key={mealType} className="border border-neutral-200 rounded-xl p-3">
                                                    <div className="flex items-center gap-1 mb-2">
                                                        <span className="text-sm">{mealIcon}</span>
                                                        <span className="text-xs font-medium text-neutral-700">
                                                            {mealName}
                                                        </span>
                                                    </div>
                                                    {meal ? (
                                                        <div>
                                                            <div className="text-sm font-medium text-neutral-900 mb-1">
                                                                {meal.recipe.name}
                                                            </div>
                                                            <div className="text-xs text-neutral-600">
                                                                {meal.recipe.nutrition.calories} kkal
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-neutral-400">
                                                            Belum ada menu
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
                    <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        Belum Ada Menu Mingguan
                    </h3>
                    <p className="text-neutral-600 mb-6">
                        Buat saran menu mingguan untuk memudahkan perencanaan MPASI
                    </p>
                    <button
                        type="button"
                        onClick={generateWeeklySuggestions}
                        disabled={generating}
                        className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Sparkles className="w-4 h-4" />
                        {generating ? 'Membuat Saran Menu...' : 'Buat Saran Menu Mingguan'}
                    </button>
                </div>
            )}
        </div>
    )
}