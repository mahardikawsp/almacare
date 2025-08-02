'use client'

import { useState, useEffect } from 'react'
import { Child, WeeklyMenuPlan, MealType } from '@/types'
import { MenuPlanningService } from '@/lib/menu-planning-service'
import { Button } from '@/components/ui/button'
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

    const formatWeekRange = (start: Date, end: Date) => {
        return `${start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
    }

    const mealTypes: MealType[] = ['BREAKFAST', 'SNACK_MORNING', 'LUNCH', 'SNACK_AFTERNOON', 'DINNER']
    const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

    return (
        <div className="space-y-6">
            {/* Week Navigation */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateWeek('prev')}
                        className="p-2"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-neutral-900">
                            Menu Mingguan
                        </h2>
                        <p className="text-neutral-600">
                            {weeklyPlan && formatWeekRange(weeklyPlan.startDate, weeklyPlan.endDate)}
                        </p>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateWeek('next')}
                        className="p-2"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Generate Suggestions Button */}
            <div className="text-center">
                <Button
                    variant="default"
                    onClick={generateWeeklySuggestions}
                    disabled={generating}
                    className="gap-2"
                >
                    <Sparkles className="w-4 h-4" />
                    {generating ? 'Membuat Saran Menu...' : 'Buat Saran Menu Mingguan'}
                </Button>
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
                        <div className="bg-gradient-to-r from-picton-blue to-berkeley-blue p-4 text-white">
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
                                <div className="bg-gray-50 p-4 border-b">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-neutral-600" />
                                        <h4 className="font-semibold text-neutral-900">
                                            {dayNames[dayIndex]} - {day.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
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
                                                <div key={mealType} className="border border-gray-200 rounded-lg p-3">
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
                    <Button
                        variant="default"
                        onClick={generateWeeklySuggestions}
                        disabled={generating}
                        className="gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        {generating ? 'Membuat Saran Menu...' : 'Buat Saran Menu Mingguan'}
                    </Button>
                </div>
            )}
        </div>
    )
}