'use client'

import { DailyMenuPlan, MealType } from '@/types'
import { MenuPlanningService } from '@/lib/menu-planning-service'
import { Button } from '@/components/ui/Button'
import { Plus, Trash2, RefreshCw } from 'lucide-react'
import { formatNutrition } from '@/lib/mpasi-service'

interface DailyMenuCardProps {
    menuPlan: DailyMenuPlan | null
    selectedDate: Date
    onAddMeal: (mealType: MealType) => void
    onRefresh: () => void
}

export function DailyMenuCard({
    menuPlan,
    selectedDate,
    onAddMeal,
    onRefresh
}: DailyMenuCardProps) {
    const mealTypes: MealType[] = ['BREAKFAST', 'SNACK_MORNING', 'LUNCH', 'SNACK_AFTERNOON', 'DINNER']

    const handleRemoveMeal = async (mealType: MealType) => {
        if (!menuPlan) return

        try {
            const response = await fetch(
                `/api/mpasi/menu-plans/meals?childId=${menuPlan.meals[mealTypes[0]]?.recipe.id}&date=${selectedDate.toISOString()}&mealType=${mealType}`,
                { method: 'DELETE' }
            )

            if (response.ok) {
                onRefresh()
            }
        } catch (error) {
            console.error('Error removing meal:', error)
        }
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        })
    }

    return (
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-picton-blue to-berkeley-blue p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold">Menu Harian</h3>
                        <p className="text-blue-100">{formatDate(selectedDate)}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRefresh}
                        className="text-white hover:bg-white/20"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Meals */}
            <div className="p-6 space-y-4">
                {mealTypes.map((mealType) => {
                    const meal = menuPlan?.meals[mealType]
                    const mealName = MenuPlanningService.getMealTypeDisplayName(mealType)
                    const mealIcon = MenuPlanningService.getMealTypeIcon(mealType)

                    return (
                        <div key={mealType} className="border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{mealIcon}</span>
                                    <h4 className="font-semibold text-neutral-900">{mealName}</h4>
                                </div>
                                {meal ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveMeal(mealType)}
                                        className="text-red-500 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onAddMeal(mealType)}
                                        className="text-picton-blue hover:bg-blue-50"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            {meal ? (
                                <div className="space-y-2">
                                    <div className="flex items-start gap-3">
                                        {meal.recipe.imageUrl && (
                                            <img
                                                src={meal.recipe.imageUrl}
                                                alt={meal.recipe.name}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h5 className="font-medium text-neutral-900 mb-1">
                                                {meal.recipe.name}
                                            </h5>
                                            <div className="text-sm text-neutral-600 space-y-1">
                                                {formatNutrition(meal.recipe.nutrition).map((item, index) => (
                                                    <div key={index}>{item}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {meal.notes && (
                                        <div className="text-sm text-neutral-600 bg-gray-50 p-2 rounded">
                                            <strong>Catatan:</strong> {meal.notes}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-neutral-500">
                                    <Plus className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                                    <p className="text-sm">Tambah menu {mealName.toLowerCase()}</p>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Nutrition Summary */}
            {menuPlan && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <h4 className="font-semibold text-neutral-900 mb-3">Total Nutrisi Harian</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formatNutrition(menuPlan.totalNutrition).map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="text-sm text-neutral-600">{item}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}