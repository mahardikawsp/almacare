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
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-800">
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
                    <Loader2 className="animate-spin mr-2" size={24} />
                    <span>Memuat resep...</span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {error}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && recipes.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">
                        Tidak ada resep yang ditemukan
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => handleFiltersChange({
                            search: '',
                            ageMin: undefined,
                            ageMax: undefined,
                            texture: 'all'
                        })}
                    >
                        Reset Filter
                    </Button>
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
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft size={16} />
                                Sebelumnya
                            </Button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const page = i + 1
                                    return (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? 'primary' : 'outline'}
                                            size="sm"
                                            onClick={() => handlePageChange(page)}
                                            className="w-10"
                                        >
                                            {page}
                                        </Button>
                                    )
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Selanjutnya
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}