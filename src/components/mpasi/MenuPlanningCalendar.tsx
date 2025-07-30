'use client'

import { useState, useEffect } from 'react'
import { Child, DailyMenuPlan, MealType } from '@/types'
import { DailyMenuCard } from './DailyMenuCard'
import { MealSuggestionModal } from './MealSuggestionModal'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MenuPlanningCalendarProps {
    selectedChild: Child
    selectedDate: Date
    onDateChange: (date: Date) => void
}

export function MenuPlanningCalendar({
    selectedChild,
    selectedDate,
    onDateChange
}: MenuPlanningCalendarProps) {
    const [menuPlan, setMenuPlan] = useState<DailyMenuPlan | null>(null)
    const [loading, setLoading] = useState(false)
    const [showSuggestionModal, setShowSuggestionModal] = useState(false)
    const [selectedMealType, setSelectedMealType] = useState<MealType>('BREAKFAST')

    useEffect(() => {
        fetchMenuPlan()
    }, [selectedChild.id, selectedDate])

    const fetchMenuPlan = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                `/api/mpasi/menu-plans?childId=${selectedChild.id}&date=${selectedDate.toISOString()}&type=daily`
            )
            const data = await response.json()
            setMenuPlan(data)
        } catch (error) {
            console.error('Error fetching menu plan:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddMeal = (mealType: MealType) => {
        setSelectedMealType(mealType)
        setShowSuggestionModal(true)
    }

    const handleMealAdded = () => {
        setShowSuggestionModal(false)
        fetchMenuPlan()
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
                            {formatDate(selectedDate)}
                        </h2>
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

            {/* Daily Menu */}
            {loading ? (
                <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="text-neutral-600 mt-4">Memuat jadwal menu...</p>
                </div>
            ) : (
                <DailyMenuCard
                    menuPlan={menuPlan}
                    selectedDate={selectedDate}
                    onAddMeal={handleAddMeal}
                    onRefresh={fetchMenuPlan}
                />
            )}

            {/* Meal Suggestion Modal */}
            {showSuggestionModal && (
                <MealSuggestionModal
                    childId={selectedChild.id}
                    date={selectedDate}
                    mealType={selectedMealType}
                    onClose={() => setShowSuggestionModal(false)}
                    onMealAdded={handleMealAdded}
                />
            )}
        </div>
    )
}