'use client'

import { useState, useEffect } from 'react'
import { MealType, MenuSuggestion, MPASIRecipeWithDetails } from '@/types'
import { MenuPlanningService } from '@/lib/menu-planning-service'
import { Button } from '@/components/ui/Button'
import { X, Clock, ChefHat } from 'lucide-react'
import { formatNutrition, getAgeRangeDisplay, getTextureDisplayName } from '@/lib/mpasi-service'

interface MealSuggestionModalProps {
    childId: string
    date: Date
    mealType: MealType
    onClose: () => void
    onMealAdded: () => void
}

export function MealSuggestionModal({
    childId,
    date,
    mealType,
    onClose,
    onMealAdded
}: MealSuggestionModalProps) {
    const [suggestions, setSuggestions] = useState<MenuSuggestion | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedRecipe, setSelectedRecipe] = useState<MPASIRecipeWithDetails | null>(null)
    const [notes, setNotes] = useState('')
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        fetchSuggestions()
    }, [childId, date, mealType])

    const fetchSuggestions = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                `/api/mpasi/menu-plans/suggestions?childId=${childId}&date=${date.toISOString()}&mealType=${mealType}`
            )
            const data = await response.json()
            setSuggestions(data)
        } catch (error) {
            console.error('Error fetching suggestions:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddMeal = async () => {
        if (!selectedRecipe) return

        setAdding(true)
        try {
            const response = await fetch('/api/mpasi/menu-plans/meals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    childId,
                    date: date.toISOString(),
                    mealType,
                    recipeId: selectedRecipe.id,
                    notes: notes.trim() || undefined
                })
            })

            if (response.ok) {
                onMealAdded()
            }
        } catch (error) {
            console.error('Error adding meal:', error)
        } finally {
            setAdding(false)
        }
    }

    const mealName = MenuPlanningService.getMealTypeDisplayName(mealType)
    const mealIcon = MenuPlanningService.getMealTypeIcon(mealType)

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-picton-blue to-berkeley-blue p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{mealIcon}</span>
                            <div>
                                <h3 className="text-xl font-bold">Pilih Menu {mealName}</h3>
                                <p className="text-blue-100">
                                    {date.toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long'
                                    })}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="text-white hover:bg-white/20"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
                            <p className="text-neutral-600">Mencari rekomendasi menu...</p>
                        </div>
                    ) : suggestions ? (
                        <div className="space-y-6">
                            {/* Reason */}
                            <div className="bg-blue-50 p-4 rounded-xl">
                                <p className="text-berkeley-blue font-medium">{suggestions.reason}</p>
                            </div>

                            {/* Recipe Options */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-neutral-900">Pilih Resep:</h4>
                                {suggestions.recipes.map((recipe) => (
                                    <div
                                        key={recipe.id}
                                        className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedRecipe?.id === recipe.id
                                            ? 'border-picton-blue bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => setSelectedRecipe(recipe)}
                                    >
                                        <div className="flex gap-4">
                                            {recipe.imageUrl && (
                                                <img
                                                    src={recipe.imageUrl}
                                                    alt={recipe.name}
                                                    className="w-20 h-20 rounded-lg object-cover"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h5 className="font-semibold text-neutral-900 mb-2">
                                                    {recipe.name}
                                                </h5>
                                                <div className="flex items-center gap-4 text-sm text-neutral-600 mb-2">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{getAgeRangeDisplay(recipe.ageRangeMin, recipe.ageRangeMax)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <ChefHat className="w-4 h-4" />
                                                        <span>{getTextureDisplayName(recipe.texture)}</span>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-neutral-600">
                                                    {formatNutrition(recipe.nutrition).slice(0, 2).join(' • ')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Notes */}
                            {selectedRecipe && (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-2">
                                            Catatan (opsional)
                                        </label>
                                        <textarea
                                            id="notes"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Tambahkan catatan untuk menu ini..."
                                            className="form-input w-full h-20 resize-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-neutral-600">Tidak ada rekomendasi menu tersedia</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6">
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAddMeal}
                            disabled={!selectedRecipe || adding}
                        >
                            {adding ? 'Menambahkan...' : 'Tambah ke Menu'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}