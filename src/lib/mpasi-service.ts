import type { Ingredient, NutritionInfo } from '@/types'
import type { Texture } from '@prisma/client'

export interface MPASIRecipeFilters {
    ageMin?: number
    ageMax?: number
    texture?: Texture | 'all'
    search?: string
    childId?: string
    page?: number
    limit?: number
}

const baseUrl = '/api/mpasi'

// Get recipes with filtering
export async function getRecipes(filters: MPASIRecipeFilters = {}) {
    const params = new URLSearchParams()

    if (filters.ageMin) params.append('ageMin', filters.ageMin.toString())
    if (filters.ageMax) params.append('ageMax', filters.ageMax.toString())
    if (filters.texture && filters.texture !== 'all') params.append('texture', filters.texture)
    if (filters.search) params.append('search', filters.search)
    if (filters.childId) params.append('childId', filters.childId)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    const response = await fetch(`${baseUrl}/recipes?${params}`)
    if (!response.ok) {
        throw new Error('Failed to fetch recipes')
    }
    return response.json()
}

// Get single recipe by ID
export async function getRecipe(id: string, childId?: string) {
    const params = new URLSearchParams()
    if (childId) params.append('childId', childId)

    const response = await fetch(`${baseUrl}/recipes/${id}?${params}`)
    if (!response.ok) {
        throw new Error('Failed to fetch recipe')
    }
    return response.json()
}

// Create new recipe
export async function createRecipe(recipe: {
    name: string
    ageRangeMin: number
    ageRangeMax: number
    texture: Texture
    ingredients: Ingredient[]
    instructions: string[]
    nutrition: NutritionInfo
    imageUrl?: string
}) {
    const response = await fetch(`${baseUrl}/recipes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipe)
    })

    if (!response.ok) {
        throw new Error('Failed to create recipe')
    }
    return response.json()
}

// Update recipe
export async function updateRecipe(id: string, updates: Partial<{
    name: string
    ageRangeMin: number
    ageRangeMax: number
    texture: Texture
    ingredients: Ingredient[]
    instructions: string[]
    nutrition: NutritionInfo
    imageUrl: string
}>) {
    const response = await fetch(`${baseUrl}/recipes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
    })

    if (!response.ok) {
        throw new Error('Failed to update recipe')
    }
    return response.json()
}

// Delete recipe
export async function deleteRecipe(id: string) {
    const response = await fetch(`${baseUrl}/recipes/${id}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error('Failed to delete recipe')
    }
    return response.json()
}

// Get favorite recipes for a child
export async function getFavorites(childId: string) {
    const response = await fetch(`${baseUrl}/favorites?childId=${childId}`)
    if (!response.ok) {
        throw new Error('Failed to fetch favorites')
    }
    return response.json()
}

// Add recipe to favorites
export async function addToFavorites(childId: string, recipeId: string) {
    const response = await fetch(`${baseUrl}/favorites`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ childId, recipeId })
    })

    if (!response.ok) {
        throw new Error('Failed to add to favorites')
    }
    return response.json()
}

// Remove recipe from favorites
export async function removeFromFavorites(childId: string, recipeId: string) {
    const response = await fetch(`${baseUrl}/favorites?childId=${childId}&recipeId=${recipeId}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error('Failed to remove from favorites')
    }
    return response.json()
}

// Get age-appropriate recipes for a child
export async function getRecipesForChild(childId: string, birthDate: Date) {
    const ageInMonths = calculateAgeInMonths(birthDate)

    return getRecipes({
        ageMin: Math.max(6, ageInMonths - 1), // MPASI starts at 6 months
        ageMax: ageInMonths + 2, // Include recipes for slightly older age
        childId
    })
}

// Calculate child's age in months
export function calculateAgeInMonths(birthDate: Date): number {
    const now = new Date()
    const birth = new Date(birthDate)

    const yearDiff = now.getFullYear() - birth.getFullYear()
    const monthDiff = now.getMonth() - birth.getMonth()

    return yearDiff * 12 + monthDiff
}

// Get texture recommendations based on age
export function getTextureRecommendations(ageInMonths: number): Texture[] {
    if (ageInMonths < 6) return []
    if (ageInMonths < 8) return ['PUREE']
    if (ageInMonths < 10) return ['PUREE', 'MASHED']
    if (ageInMonths < 12) return ['MASHED', 'FINGER_FOOD']
    return ['MASHED', 'FINGER_FOOD', 'FAMILY_FOOD']
}

// Format nutrition information for display
export function formatNutrition(nutrition: NutritionInfo): string[] {
    const formatted = [
        `Kalori: ${nutrition.calories} kkal`,
        `Protein: ${nutrition.protein}g`,
        `Lemak: ${nutrition.fat}g`,
        `Karbohidrat: ${nutrition.carbohydrates}g`
    ]

    if (nutrition.fiber) {
        formatted.push(`Serat: ${nutrition.fiber}g`)
    }

    return formatted
}

// Get texture display name in Indonesian
export function getTextureDisplayName(texture: Texture): string {
    const textureNames = {
        PUREE: 'Bubur Halus',
        MASHED: 'Bubur Kasar',
        FINGER_FOOD: 'Makanan Jari',
        FAMILY_FOOD: 'Makanan Keluarga'
    }
    return textureNames[texture] || texture
}

// Get age range display
export function getAgeRangeDisplay(ageRangeMin: number, ageRangeMax: number): string {
    if (ageRangeMin === ageRangeMax) {
        return `${ageRangeMin} bulan`
    }
    return `${ageRangeMin}-${ageRangeMax} bulan`
}

// Legacy class export for backward compatibility
export const MPASIService = {
    getRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    getRecipesForChild,
    calculateAgeInMonths,
    getTextureRecommendations,
    formatNutrition,
    getTextureDisplayName,
    getAgeRangeDisplay
}