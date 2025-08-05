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

                {/* Favorite Button on Image */}
                {childId && (
                    <button
                        type="button"
                        onClick={handleFavoriteToggle}
                        disabled={isUpdatingFavorite}
                        title={isFavorite ? 'Hapus' : 'Tambah'}
                        className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm ${isFavorite
                            ? 'bg-red-500 text-white scale-110 shadow-red-200'
                            : 'bg-white/95 text-gray-600 hover:bg-white hover:scale-105 hover:shadow-xl'
                            } ${isUpdatingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={isFavorite ? 1.5 : 2} />
                    </button>
                )}
            </div>

            {/* Recipe Content */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {recipe.name}
                </h3>

                {/* Recipe Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <Clock size={14} />
                        <span className="text-xs sm:text-sm">{MPASIService.getAgeRangeDisplay(recipe.ageRangeMin, recipe.ageRangeMax)}</span>
                    </div>
                    <div className="px-2 py-1 bg-alice-blue text-berkeley-blue rounded-full text-xs w-fit">
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