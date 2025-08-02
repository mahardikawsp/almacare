'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Utensils, Clock, Heart, ChefHat, Calendar, Plus, Star } from 'lucide-react'
// Define types locally to avoid import issues
interface MPASIRecipeWithDetails {
    id: string
    name: string
    ageRangeMin: number
    ageRangeMax: number
    texture: string
    nutrition: {
        calories: number
        protein: number
        fat: number
        carbohydrates: number
    }
    ingredients: Array<{
        name: string
        amount: string
        unit: string
    }>
    instructions: string[]
    isFavorite?: boolean
    imageUrl?: string
}

interface DailyMenuPlan {
    date: Date
    meals: {
        [key: string]: {
            id: string
            recipe: MPASIRecipeWithDetails
            mealType: string
            scheduledTime: Date
        }
    }
    totalNutrition: {
        calories: number
        protein: number
        fat: number
        carbohydrates: number
    }
}

interface NutritionSummary {
    daily: {
        calories: number
        protein: number
        fat: number
        carbohydrates: number
    }
    recommended: {
        calories: number
        protein: number
        fat: number
        carbohydrates: number
    }
    percentage: {
        calories: number
        protein: number
        fat: number
        carbohydrates: number
    }
}
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface MPASICardProps extends React.HTMLAttributes<HTMLDivElement> {
    child: {
        id: string
        name: string
        birthDate: Date
        ageInMonths: number
    }
    todayMenu?: DailyMenuPlan
    favoriteRecipes: MPASIRecipeWithDetails[]
    nutritionSummary?: NutritionSummary
    onViewMenu?: () => void
    onViewRecipes?: () => void
    onPlanMenu?: () => void
    onViewNutrition?: () => void
    isLoading?: boolean
}

const MPASICard = React.forwardRef<HTMLDivElement, MPASICardProps>(
    ({
        className,
        child,
        todayMenu,
        favoriteRecipes,
        nutritionSummary,
        onViewMenu,
        onViewRecipes,
        onPlanMenu,
        onViewNutrition,
        isLoading = false,
        ...props
    }, ref) => {
        const getAgeAppropriateMessage = (ageInMonths: number) => {
            if (ageInMonths < 6) {
                return "Belum waktunya MPASI. ASI eksklusif hingga 6 bulan."
            }
            if (ageInMonths < 8) {
                return "Fase pengenalan MPASI (6-8 bulan)"
            }
            if (ageInMonths < 12) {
                return "Fase eksplorasi rasa (8-12 bulan)"
            }
            if (ageInMonths < 24) {
                return "Fase transisi makanan keluarga (12-24 bulan)"
            }
            return "Sudah bisa makan makanan keluarga"
        }

        const getMealTypeIcon = (mealType: string) => {
            switch (mealType.toLowerCase()) {
                case 'breakfast':
                    return '🌅'
                case 'lunch':
                    return '☀️'
                case 'dinner':
                    return '🌙'
                case 'snack':
                    return '🍎'
                default:
                    return '🍽️'
            }
        }

        const getMealTypeName = (mealType: string) => {
            switch (mealType.toLowerCase()) {
                case 'breakfast':
                    return 'Sarapan'
                case 'lunch':
                    return 'Makan Siang'
                case 'dinner':
                    return 'Makan Malam'
                case 'snack':
                    return 'Camilan'
                default:
                    return mealType
            }
        }

        const getNutritionPercentageColor = (percentage: number) => {
            if (percentage >= 80) return 'text-green-600 bg-green-50'
            if (percentage >= 60) return 'text-yellow-600 bg-yellow-50'
            return 'text-red-600 bg-red-50'
        }

        if (isLoading) {
            return (
                <Card ref={ref} className={cn("animate-pulse", className)} {...props}>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                                <div>
                                    <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="h-16 bg-gray-200 rounded-lg"></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-12 bg-gray-200 rounded"></div>
                                <div className="h-12 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    </CardContent>
                </Card>
            )
        }

        // Check if child is ready for MPASI
        if (child.ageInMonths < 6) {
            return (
                <Card
                    ref={ref}
                    className={cn(
                        "hover:shadow-soft-lg transition-all duration-200 min-h-touch",
                        className
                    )}
                    variant="interactive"
                    {...props}
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                                <Utensils className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Menu MPASI</CardTitle>
                                <CardDescription>
                                    {child.name} • {child.ageInMonths} bulan
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="text-center py-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2">
                            ASI Eksklusif
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {getAgeAppropriateMessage(child.ageInMonths)}
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-800">
                                MPASI akan tersedia saat {child.name} berusia 6 bulan
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )
        }

        return (
            <Card
                ref={ref}
                className={cn(
                    "hover:shadow-soft-lg transition-all duration-200 min-h-touch",
                    className
                )}
                variant="interactive"
                {...props}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                                <Utensils className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Menu MPASI</CardTitle>
                                <CardDescription>
                                    {child.name} • {getAgeAppropriateMessage(child.ageInMonths)}
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Today's Menu */}
                    {todayMenu ? (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-gray-900">
                                    Menu Hari Ini
                                </h4>
                                <span className="text-xs text-gray-500">
                                    {format(todayMenu.date, 'dd MMM', { locale: id })}
                                </span>
                            </div>

                            <div className="space-y-2">
                                {Object.entries(todayMenu.meals).map(([mealType, meal]) => (
                                    meal && (
                                        <div
                                            key={mealType}
                                            className="flex items-center gap-3 p-2 bg-alice-blue rounded-lg"
                                        >
                                            <span className="text-lg">{getMealTypeIcon(mealType)}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-berkeley-blue truncate">
                                                    {meal.recipe.name}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {getMealTypeName(mealType)} • {meal.recipe.nutrition.calories} kkal
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>

                            {/* Nutrition Summary */}
                            {nutritionSummary && (
                                <div className="bg-green-50 rounded-lg p-3 mt-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-green-900">
                                            Nutrisi Harian
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onViewNutrition?.()
                                            }}
                                            className="text-xs text-green-700 hover:text-green-800 p-1 h-auto"
                                        >
                                            Detail
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-green-700">Kalori:</span>
                                            <span className={cn(
                                                "px-1 rounded",
                                                getNutritionPercentageColor(nutritionSummary.percentage.calories)
                                            )}>
                                                {nutritionSummary.percentage.calories}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-green-700">Protein:</span>
                                            <span className={cn(
                                                "px-1 rounded",
                                                getNutritionPercentageColor(nutritionSummary.percentage.protein)
                                            )}>
                                                {nutritionSummary.percentage.protein}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-3">
                                Belum ada menu untuk hari ini
                            </p>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onPlanMenu?.()
                                }}
                                size="sm"
                                className="min-h-touch"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Buat Menu
                            </Button>
                        </div>
                    )}

                    {/* Favorite Recipes */}
                    {favoriteRecipes.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-gray-900">
                                    Resep Favorit
                                </h4>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onViewRecipes?.()
                                    }}
                                    className="text-xs text-picton-blue hover:text-picton-blue/80 p-1 h-auto"
                                >
                                    Lihat Semua
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {favoriteRecipes.slice(0, 4).map((recipe) => (
                                    <div
                                        key={recipe.id}
                                        className="bg-white border border-gray-200 rounded-lg p-2 hover:shadow-sm transition-shadow cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            // Handle recipe detail view
                                        }}
                                    >
                                        <div className="flex items-start gap-2">
                                            <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs font-medium text-gray-900 truncate">
                                                    {recipe.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {recipe.nutrition.calories} kkal
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                                onViewMenu?.()
                            }}
                            className="flex-1 min-h-touch"
                            size="sm"
                        >
                            <ChefHat className="w-4 h-4 mr-2" />
                            Lihat Menu
                        </Button>
                        <Button
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation()
                                onViewRecipes?.()
                            }}
                            className="flex-1 min-h-touch"
                            size="sm"
                        >
                            <Clock className="w-4 h-4 mr-2" />
                            Resep
                        </Button>
                    </div>

                    {/* Age-appropriate Tips */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <Utensils className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-orange-900 mb-1">
                                    Tips untuk usia {child.ageInMonths} bulan:
                                </p>
                                <p className="text-orange-800 text-xs">
                                    {child.ageInMonths < 8
                                        ? "Berikan makanan dengan tekstur halus dan lembut. Mulai dengan sayuran dan buah-buahan."
                                        : child.ageInMonths < 12
                                            ? "Mulai perkenalkan finger foods dan tekstur yang lebih kasar untuk melatih kemampuan mengunyah."
                                            : "Anak sudah bisa makan makanan keluarga dengan porsi yang disesuaikan."
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }
)

MPASICard.displayName = 'MPASICard'

export { MPASICard }