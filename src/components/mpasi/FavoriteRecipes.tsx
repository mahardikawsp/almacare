'use client'

import { useState, useEffect } from 'react'
import { MPASIRecipeWithDetails, Child } from '@/types'
import { MPASIService } from '@/lib/mpasi-service'
import { RecipeCard } from './RecipeCard'
import { RecipeDetail } from './RecipeDetail'
import { Heart, Loader2 } from 'lucide-react'

interface FavoriteRecipesProps {
    selectedChild: Child
}

export function FavoriteRecipes({ selectedChild }: FavoriteRecipesProps) {
    const [favorites, setFavorites] = useState<MPASIRecipeWithDetails[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedRecipe, setSelectedRecipe] = useState<MPASIRecipeWithDetails | null>(null)

    const fetchFavorites = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await MPASIService.getFavorites(selectedChild.id)

            if (response.success) {
                setFavorites(response.data)
            } else {
                setError(response.error || 'Failed to fetch favorite recipes')
            }
        } catch (err) {
            setError('Failed to fetch favorite recipes')
            console.error('Error fetching favorites:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFavorites()
    }, [selectedChild.id]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleFavoriteChange = (recipeId: string, isFavorite: boolean) => {
        if (!isFavorite) {
            // Remove from favorites list
            setFavorites(prev => prev.filter(recipe => recipe.id !== recipeId))

            // Close detail view if it's the removed recipe
            if (selectedRecipe?.id === recipeId) {
                setSelectedRecipe(null)
            }
        }
    }

    const handleRecipeClick = async (recipe: MPASIRecipeWithDetails) => {
        try {
            // Fetch full recipe details
            const response = await MPASIService.getRecipe(recipe.id, selectedChild.id)
            if (response.success) {
                setSelectedRecipe(response.data)
            }
        } catch (err) {
            console.error('Error fetching recipe details:', err)
            setSelectedRecipe(recipe) // Fallback to basic recipe data
        }
    }

    if (selectedRecipe) {
        return (
            <RecipeDetail
                recipe={selectedRecipe}
                childId={selectedChild.id}
                onFavoriteChange={handleFavoriteChange}
                onClose={() => setSelectedRecipe(null)}
            />
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Heart className="text-red-500" size={24} fill="currentColor" />
                <h2 className="text-xl font-semibold text-gray-900">
                    Resep Favorit {selectedChild.name}
                </h2>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin mr-2" size={24} />
                    <span>Memuat resep favorit...</span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {error}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && favorites.length === 0 && (
                <div className="text-center py-12">
                    <Heart className="mx-auto mb-4 text-gray-300" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Belum Ada Resep Favorit
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Tambahkan resep ke favorit untuk memudahkan akses di kemudian hari
                    </p>
                </div>
            )}

            {/* Favorites Grid */}
            {!loading && !error && favorites.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            childId={selectedChild.id}
                            onFavoriteChange={handleFavoriteChange}
                            onClick={() => handleRecipeClick(recipe)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}