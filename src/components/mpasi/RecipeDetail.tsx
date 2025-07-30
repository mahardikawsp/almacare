'use client'

import { useState } from 'react'
import { MPASIRecipeWithDetails } from '@/types'
import { MPASIService } from '@/lib/mpasi-service'
import { Button } from '@/components/ui/Button'
import { Heart, Clock, Users, ChefHat, Info } from 'lucide-react'

interface RecipeDetailProps {
    recipe: MPASIRecipeWithDetails
    childId?: string
    onFavoriteChange?: (recipeId: string, isFavorite: boolean) => void
    onClose?: () => void
}

export function RecipeDetail({ recipe, childId, onFavoriteChange, onClose }: RecipeDetailProps) {
    const [isFavorite, setIsFavorite] = useState(recipe.isFavorite || false)
    const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false)

    const handleFavoriteToggle = async () => {
        if (!childId || isUpdatingFavorite) return

        setIsUpdatingFavorite(true)
        try {
            if (isFavorite) {
                await MPASIService.removeFromFavorites(childId, recipe.id)
            } else {
                await MPASIService.addToFavorites(childId, recipe.id)
            }

            const newFavoriteState = !isFavorite
            setIsFavorite(newFavoriteState)
            onFavoriteChange?.(recipe.id, newFavoriteState)
        } catch (error) {
            console.error('Error updating favorite:', error)
        } finally {
            setIsUpdatingFavorite(false)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
            {/* Header */}
            <div className="relative">
                {recipe.imageUrl ? (
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        className="w-full h-64 object-cover rounded-t-lg"
                    />
                ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-t-lg flex items-center justify-center">
                        <ChefHat size={64} className="text-gray-400" />
                    </div>
                )}

                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray p-2 rounded-full transition-colors"
                    >
                        ×
                    </button>
                )}
            </div>

            <div className="p-6">
                {/* Recipe Title and Meta */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{recipe.name}</h1>

                        <div className="flex items-center gap-4 text-sm text-gray">
                            <div className="flex items-center gap-1">
                                <Clock size={16} />
                                <span>{MPASIService.getAgeRangeDisplay(recipe.ageRangeMin, recipe.ageRangeMax)}</span>
                            </div>
                            <div className="px-3 py-1 bg-alice-blue text-berkeley-blue rounded-full">
                                {MPASIService.getTextureDisplayName(recipe.texture)}
                            </div>
                        </div>
                    </div>

                    {/* Favorite Button */}
                    {childId && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleFavoriteToggle}
                            disabled={isUpdatingFavorite}
                            className={`ml-4 ${isFavorite ? 'text-picton-blue border-alice-blue' : ''}`}
                        >
                            <Heart
                                size={16}
                                fill={isFavorite ? 'currentColor' : 'none'}
                                className="mr-2"
                            />
                            {isFavorite ? 'Favorit' : 'Tambah ke Favorit'}
                        </Button>
                    )}
                </div>

                {/* Nutrition Information */}
                <div className="bg-alice-blue rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-berkeley-blue mb-3 flex items-center gap-2">
                        <Info size={16} />
                        Informasi Gizi
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        {MPASIService.formatNutrition(recipe.nutrition).map((item, index) => (
                            <div key={index} className="text-berkeley-blue">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ingredients */}
                <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Users size={16} />
                        Bahan-bahan
                    </h3>
                    <ul className="space-y-2">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="flex items-center gap-3 text-gray-700">
                                <span className="w-2 h-2 bg-picton-blue rounded-full flex-shrink-0"></span>
                                <span>
                                    <strong>{ingredient.name}</strong> - {ingredient.amount} {ingredient.unit}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Instructions */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ChefHat size={16} />
                        Cara Membuat
                    </h3>
                    <ol className="space-y-3">
                        {recipe.instructions.map((instruction, index) => (
                            <li key={index} className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-picton-blue text-white text-sm rounded-full flex items-center justify-center font-medium">
                                    {index + 1}
                                </span>
                                <span className="text-gray-700 leading-relaxed">{instruction}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    )
}