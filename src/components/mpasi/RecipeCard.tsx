'use client'

import { useState } from 'react'
import { MPASIRecipeWithDetails } from '@/types'
import { MPASIService } from '@/lib/mpasi-service'

import { Heart, Clock, Users } from 'lucide-react'

interface RecipeCardProps {
    recipe: MPASIRecipeWithDetails
    childId?: string
    onFavoriteChange?: (recipeId: string, isFavorite: boolean) => void
    onClick?: () => void
}

export function RecipeCard({ recipe, childId, onFavoriteChange, onClick }: RecipeCardProps) {
    const [isFavorite, setIsFavorite] = useState(recipe.isFavorite || false)
    const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false)

    const handleFavoriteToggle = async (e: React.MouseEvent) => {
        e.stopPropagation()

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
        <div
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={onClick}
        >
            {/* Recipe Image */}
            <div className="relative h-48 bg-gray-100">
                {recipe.imageUrl ? (
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Users size={48} />
                    </div>
                )}

                {/* Favorite Button */}
                {childId && (
                    <button
                        onClick={handleFavoriteToggle}
                        disabled={isUpdatingFavorite}
                        className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isFavorite
                            ? 'bg-picton-blue text-white'
                            : 'bg-white/80 text-gray hover:bg-white'
                            } ${isUpdatingFavorite ? 'opacity-50' : ''}`}
                    >
                        <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                )}
            </div>

            {/* Recipe Content */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {recipe.name}
                </h3>

                {/* Recipe Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{MPASIService.getAgeRangeDisplay(recipe.ageRangeMin, recipe.ageRangeMax)}</span>
                    </div>
                    <div className="px-2 py-1 bg-alice-blue text-berkeley-blue rounded-full text-xs">
                        {MPASIService.getTextureDisplayName(recipe.texture)}
                    </div>
                </div>

                {/* Nutrition Summary */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Kalori: {recipe.nutrition.calories} kkal</div>
                    <div>Protein: {recipe.nutrition.protein}g</div>
                </div>
            </div>
        </div>
    )
}