'use client'

import { useState, useEffect } from 'react'
import { MPASIRecipeWithDetails, Child } from '@/types'
import { MPASIService } from '@/lib/mpasi-service'
import { RecipeCard } from './RecipeCard'
import { RecipeFilters } from './RecipeFilters'
import { RecipeDetail } from './RecipeDetail'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

interface RecipeListProps {
    selectedChild?: Child
}

export function RecipeList({ selectedChild }: RecipeListProps) {
    const [recipes, setRecipes] = useState<MPASIRecipeWithDetails[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedRecipe, setSelectedRecipe] = useState<MPASIRecipeWithDetails | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [filters, setFilters] = useState<{
        search: string
        ageMin: number | undefined
        ageMax: number | undefined
        texture: 'all' | 'PUREE' | 'MASHED' | 'FINGER_FOOD' | 'FAMILY_FOOD'
    }>({
        search: '',
        ageMin: undefined,
        ageMax: undefined,
        texture: 'all'
    })

    const childAge = selectedChild ? MPASIService.calculateAgeInMonths(new Date(selectedChild.birthDate)) : undefined

    const fetchRecipes = async (page = 1) => {
        setLoading(true)
        setError(null)

        try {
            const response = await MPASIService.getRecipes({
                ...filters,
                childId: selectedChild?.id,
                page,
                limit: 12
            })

            if (response.success) {
                setRecipes(response.data)
                setTotalPages(response.pagination.totalPages)
                setCurrentPage(response.pagination.page)
            } else {
                setError(response.error || 'Failed to fetch recipes')
            }
        } catch (err) {
            setError('Failed to fetch recipes')
            console.error('Error fetching recipes:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRecipes(1)
    }, [filters, selectedChild]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleFiltersChange = (newFilters: typeof filters) => {
        setFilters(newFilters)
        setCurrentPage(1)
    }

    const handleFavoriteChange = (recipeId: string, isFavorite: boolean) => {
        setRecipes(prev => prev.map(recipe =>
            recipe.id === recipeId ? { ...recipe, isFavorite } : recipe
        ))

        if (selectedRecipe?.id === recipeId) {
            setSelectedRecipe(prev => prev ? { ...prev, isFavorite } : null)
        }
    }

    const handleRecipeClick = async (recipe: MPASIRecipeWithDetails) => {
        try {
            // Fetch full recipe details
            const response = await MPASIService.getRecipe(recipe.id, selectedChild?.id)
            if (response.success) {
                setSelectedRecipe(response.data)
            }
        } catch (err) {
            console.error('Error fetching recipe details:', err)
            setSelectedRecipe(recipe) // Fallback to basic recipe data
        }
    }

    const handlePageChange = (page: number) => {
        fetchRecipes(page)
    }

    if (selectedRecipe) {
        return (
            <RecipeDetail
                recipe={selectedRecipe}
                childId={selectedChild?.id}
                onFavoriteChange={handleFavoriteChange}
                onClose={() => setSelectedRecipe(null)}
            />
        )
    }

    return (
        <div className="space-y-6">
            {/* Age Warning for Young Children */}
            {selectedChild && childAge && childAge < 6 && (
                <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-primary-800">
                        <span className="font-medium">Perhatian:</span>
                        <span>
                            MPASI direkomendasikan untuk bayi berusia 6 bulan ke atas.
                            {selectedChild.name} saat ini berusia {childAge} bulan.
                        </span>
                    </div>
                </div>
            )}

            {/* Filters */}
            <RecipeFilters
                onFiltersChange={handleFiltersChange}
                childAge={childAge && childAge >= 6 ? childAge : undefined}
            />

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin mr-2 text-primary-500" size={24} />
                    <span className="text-neutral-600">Memuat resep...</span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-secondary-50 border border-secondary-200 rounded-2xl p-4 text-secondary-700">
                    {error}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && recipes.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-neutral-500 mb-4">
                        Tidak ada resep yang ditemukan
                    </div>
                    <button
                        type="button"
                        onClick={() => handleFiltersChange({
                            search: '',
                            ageMin: undefined,
                            ageMax: undefined,
                            texture: 'all'
                        })}
                        className="bg-neutral-100 text-neutral-700 border border-neutral-300 px-4 py-2 rounded-xl font-medium hover:bg-neutral-200 transition-colors"
                    >
                        Reset Filter
                    </button>
                </div>
            )}

            {/* Recipe Grid */}
            {!loading && !error && recipes.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                childId={selectedChild?.id}
                                onFavoriteChange={handleFavoriteChange}
                                onClick={() => handleRecipeClick(recipe)}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                type="button"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 bg-neutral-100 text-neutral-700 border border-neutral-300 px-3 py-2 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                                Sebelumnya
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const page = i + 1
                                    return (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => handlePageChange(page)}
                                            className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${currentPage === page
                                                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                                                : 'bg-neutral-100 text-neutral-700 border border-neutral-300 hover:bg-neutral-200'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                })}
                            </div>

                            <button
                                type="button"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 bg-neutral-100 text-neutral-700 border border-neutral-300 px-3 py-2 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Selanjutnya
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}