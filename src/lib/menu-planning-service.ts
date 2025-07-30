import { prisma } from './prisma'
import type {
    MPASIMealWithRecipe,
    DailyMenuPlan,
    WeeklyMenuPlan,
    MenuSuggestion,
    NutritionInfo,
    NutritionSummary,
    MealType,
    Ingredient,
    Texture
} from '@/types'
import { calculateAgeInMonths, getTextureRecommendations } from './mpasi-service'

// Type for Prisma query result
type PrismaMenuPlanResult = {
    id: string
    childId: string
    date: Date
    createdAt: Date
    updatedAt: Date
    meals: {
        id: string
        menuPlanId: string
        mealType: MealType
        recipeId: string
        notes: string | null
        createdAt: Date
        updatedAt: Date
        recipe: {
            id: string
            name: string
            ageRangeMin: number
            ageRangeMax: number
            texture: unknown
            ingredients: unknown
            instructions: unknown
            nutrition: unknown
            imageUrl: string | null
            createdAt: Date
            updatedAt: Date
        }
    }[]
}

// Get menu plan for a specific date
export async function getMenuPlan(childId: string, date: Date): Promise<DailyMenuPlan | null> {
    const menuPlan = await prisma.mPASIMenuPlan.findUnique({
        where: {
            childId_date: {
                childId,
                date: new Date(date.toDateString())
            }
        },
        include: {
            meals: {
                include: {
                    recipe: true
                }
            }
        }
    })

    if (!menuPlan) return null

    return transformToDailyMenuPlan(menuPlan as PrismaMenuPlanResult)
}

// Get weekly menu plan
export async function getWeeklyMenuPlan(childId: string, startDate: Date): Promise<WeeklyMenuPlan> {
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6)

    const menuPlans = await prisma.mPASIMenuPlan.findMany({
        where: {
            childId,
            date: {
                gte: new Date(startDate.toDateString()),
                lte: new Date(endDate.toDateString())
            }
        },
        include: {
            meals: {
                include: {
                    recipe: true
                }
            }
        },
        orderBy: {
            date: 'asc'
        }
    })

    const days: DailyMenuPlan[] = []
    const currentDate = new Date(startDate)

    for (let i = 0; i < 7; i++) {
        const dateStr = currentDate.toDateString()
        const existingPlan = menuPlans.find(plan =>
            plan.date.toDateString() === dateStr
        )

        if (existingPlan) {
            days.push(transformToDailyMenuPlan(existingPlan as PrismaMenuPlanResult))
        } else {
            days.push({
                date: new Date(currentDate),
                meals: {},
                totalNutrition: getEmptyNutrition()
            })
        }

        currentDate.setDate(currentDate.getDate() + 1)
    }

    return {
        startDate,
        endDate,
        days,
        weeklyNutrition: calculateWeeklyNutrition(days)
    }
}

// Create or update menu plan for a specific date
export async function createOrUpdateMenuPlan(
    childId: string,
    date: Date,
    meals: { mealType: MealType; recipeId: string; notes?: string }[]
): Promise<DailyMenuPlan> {
    const menuPlan = await prisma.mPASIMenuPlan.upsert({
        where: {
            childId_date: {
                childId,
                date: new Date(date.toDateString())
            }
        },
        create: {
            childId,
            date: new Date(date.toDateString()),
            meals: {
                create: meals.map(meal => ({
                    mealType: meal.mealType,
                    recipeId: meal.recipeId,
                    notes: meal.notes
                }))
            }
        },
        update: {
            meals: {
                deleteMany: {},
                create: meals.map(meal => ({
                    mealType: meal.mealType,
                    recipeId: meal.recipeId,
                    notes: meal.notes
                }))
            }
        },
        include: {
            meals: {
                include: {
                    recipe: true
                }
            }
        }
    })

    return transformToDailyMenuPlan(menuPlan as PrismaMenuPlanResult)
}

// Add or update a single meal in a menu plan
export async function addMealToMenuPlan(
    childId: string,
    date: Date,
    mealType: MealType,
    recipeId: string,
    notes?: string
): Promise<DailyMenuPlan> {
    // First ensure menu plan exists
    const menuPlan = await prisma.mPASIMenuPlan.upsert({
        where: {
            childId_date: {
                childId,
                date: new Date(date.toDateString())
            }
        },
        create: {
            childId,
            date: new Date(date.toDateString())
        },
        update: {}
    })

    // Then upsert the meal
    await prisma.mPASIMeal.upsert({
        where: {
            menuPlanId_mealType: {
                menuPlanId: menuPlan.id,
                mealType
            }
        },
        create: {
            menuPlanId: menuPlan.id,
            mealType,
            recipeId,
            notes
        },
        update: {
            recipeId,
            notes
        }
    })

    // Return updated menu plan
    const updatedMenuPlan = await prisma.mPASIMenuPlan.findUnique({
        where: { id: menuPlan.id },
        include: {
            meals: {
                include: {
                    recipe: true
                }
            }
        }
    })

    return transformToDailyMenuPlan(updatedMenuPlan! as PrismaMenuPlanResult)
}

// Remove a meal from menu plan
export async function removeMealFromMenuPlan(
    childId: string,
    date: Date,
    mealType: MealType
): Promise<DailyMenuPlan | null> {
    const menuPlan = await prisma.mPASIMenuPlan.findUnique({
        where: {
            childId_date: {
                childId,
                date: new Date(date.toDateString())
            }
        }
    })

    if (!menuPlan) return null

    await prisma.mPASIMeal.deleteMany({
        where: {
            menuPlanId: menuPlan.id,
            mealType
        }
    })

    return getMenuPlan(childId, date)
}

// Get menu suggestions based on child's age and existing meals
export async function getMenuSuggestions(
    childId: string,
    date: Date,
    mealType: MealType
): Promise<MenuSuggestion> {
    const child = await prisma.child.findUnique({
        where: { id: childId }
    })

    if (!child) {
        throw new Error('Child not found')
    }

    const ageInMonths = calculateAgeInMonths(child.birthDate)
    const recommendedTextures = getTextureRecommendations(ageInMonths)

    // Get existing meals for the day to avoid repetition
    const existingMenuPlan = await getMenuPlan(childId, date)
    const existingRecipeIds = existingMenuPlan
        ? Object.values(existingMenuPlan.meals).map(meal => meal.recipe.id)
        : []

    // Get suitable recipes
    const recipes = await prisma.mPASIRecipe.findMany({
        where: {
            ageRangeMin: { lte: ageInMonths },
            ageRangeMax: { gte: ageInMonths },
            texture: { in: recommendedTextures },
            id: { notIn: existingRecipeIds }
        },
        take: 5,
        orderBy: [
            { createdAt: 'desc' }
        ]
    })

    const recipesWithDetails = recipes.map(recipe => ({
        ...recipe,
        ingredients: recipe.ingredients as unknown as Ingredient[],
        instructions: recipe.instructions as unknown as string[],
        nutrition: recipe.nutrition as unknown as NutritionInfo,
        texture: recipe.texture as Texture
    }))

    let reason = `Resep yang cocok untuk anak usia ${ageInMonths} bulan`

    if (mealType === 'BREAKFAST') {
        reason += ' untuk sarapan yang bergizi'
    } else if (mealType === 'LUNCH') {
        reason += ' untuk makan siang yang mengenyangkan'
    } else if (mealType === 'DINNER') {
        reason += ' untuk makan malam yang mudah dicerna'
    } else {
        reason += ' untuk camilan sehat'
    }

    return {
        mealType,
        recipes: recipesWithDetails,
        reason
    }
}

// Generate automatic menu suggestions for a week
export async function generateWeeklyMenuSuggestions(
    childId: string,
    startDate: Date
): Promise<WeeklyMenuPlan> {
    const child = await prisma.child.findUnique({
        where: { id: childId }
    })

    if (!child) {
        throw new Error('Child not found')
    }

    const ageInMonths = calculateAgeInMonths(child.birthDate)
    const recommendedTextures = getTextureRecommendations(ageInMonths)

    // Get all suitable recipes
    const allRecipes = await prisma.mPASIRecipe.findMany({
        where: {
            ageRangeMin: { lte: ageInMonths },
            ageRangeMax: { gte: ageInMonths },
            texture: { in: recommendedTextures }
        }
    })

    const days: DailyMenuPlan[] = []
    const currentDate = new Date(startDate)
    const usedRecipes = new Set<string>()

    const mealTypes: MealType[] = ['BREAKFAST', 'SNACK_MORNING', 'LUNCH', 'SNACK_AFTERNOON', 'DINNER']

    for (let day = 0; day < 7; day++) {
        const dayMeals: { [K in MealType]?: MPASIMealWithRecipe } = {}

        for (const mealType of mealTypes) {
            // Find a recipe that hasn't been used recently
            const availableRecipes = allRecipes.filter(recipe => !usedRecipes.has(recipe.id))

            if (availableRecipes.length > 0) {
                const randomRecipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)]

                dayMeals[mealType] = {
                    id: `temp-${day}-${mealType}`,
                    menuPlanId: `temp-${day}`,
                    mealType,
                    recipeId: randomRecipe.id,
                    notes: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    recipe: {
                        ...randomRecipe,
                        ingredients: randomRecipe.ingredients as unknown as Ingredient[],
                        instructions: randomRecipe.instructions as unknown as string[],
                        nutrition: randomRecipe.nutrition as unknown as NutritionInfo,
                        texture: randomRecipe.texture as Texture
                    }
                }

                usedRecipes.add(randomRecipe.id)

                // Reset used recipes if we've used too many
                if (usedRecipes.size > allRecipes.length * 0.7) {
                    usedRecipes.clear()
                }
            }
        }

        const totalNutrition = calculateDayNutrition(Object.values(dayMeals))

        days.push({
            date: new Date(currentDate),
            meals: dayMeals,
            totalNutrition
        })

        currentDate.setDate(currentDate.getDate() + 1)
    }

    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6)

    return {
        startDate,
        endDate,
        days,
        weeklyNutrition: calculateWeeklyNutrition(days)
    }
}

// Get nutrition summary for a child's menu plan
export async function getNutritionSummary(
    childId: string,
    date: Date
): Promise<NutritionSummary> {
    const menuPlan = await getMenuPlan(childId, date)
    const child = await prisma.child.findUnique({
        where: { id: childId }
    })

    if (!child) {
        throw new Error('Child not found')
    }

    const ageInMonths = calculateAgeInMonths(child.birthDate)
    const recommended = getRecommendedNutrition(ageInMonths)
    const daily = menuPlan?.totalNutrition || getEmptyNutrition()

    return {
        daily,
        recommended,
        percentage: {
            calories: Math.round((daily.calories / recommended.calories) * 100),
            protein: Math.round((daily.protein / recommended.protein) * 100),
            fat: Math.round((daily.fat / recommended.fat) * 100),
            carbohydrates: Math.round((daily.carbohydrates / recommended.carbohydrates) * 100)
        }
    }
}

// Get meal type display name in Indonesian
export function getMealTypeDisplayName(mealType: MealType): string {
    const mealNames = {
        BREAKFAST: 'Sarapan',
        LUNCH: 'Makan Siang',
        DINNER: 'Makan Malam',
        SNACK_MORNING: 'Camilan Pagi',
        SNACK_AFTERNOON: 'Camilan Sore'
    }
    return mealNames[mealType] || mealType
}

// Get meal type icon
export function getMealTypeIcon(mealType: MealType): string {
    const mealIcons = {
        BREAKFAST: '🌅',
        LUNCH: '☀️',
        DINNER: '🌙',
        SNACK_MORNING: '🍎',
        SNACK_AFTERNOON: '🥨'
    }
    return mealIcons[mealType] || '🍽️'
}

// Helper functions
function transformToDailyMenuPlan(menuPlan: PrismaMenuPlanResult): DailyMenuPlan {
    const meals: { [K in MealType]?: MPASIMealWithRecipe } = {}

    menuPlan.meals.forEach(meal => {
        meals[meal.mealType] = {
            ...meal,
            recipe: {
                ...meal.recipe,
                texture: meal.recipe.texture as unknown as Texture,
                ingredients: meal.recipe.ingredients as unknown as Ingredient[],
                instructions: meal.recipe.instructions as unknown as string[],
                nutrition: meal.recipe.nutrition as unknown as NutritionInfo
            }
        }
    })

    return {
        date: menuPlan.date,
        meals,
        totalNutrition: calculateDayNutrition(Object.values(meals))
    }
}

function calculateDayNutrition(meals: MPASIMealWithRecipe[]): NutritionInfo {
    return meals.reduce((total, meal) => {
        const nutrition = meal.recipe.nutrition
        return {
            calories: total.calories + nutrition.calories,
            protein: total.protein + nutrition.protein,
            fat: total.fat + nutrition.fat,
            carbohydrates: total.carbohydrates + nutrition.carbohydrates,
            fiber: (total.fiber || 0) + (nutrition.fiber || 0)
        }
    }, getEmptyNutrition())
}

function calculateWeeklyNutrition(days: DailyMenuPlan[]): NutritionInfo {
    const totalNutrition = days.reduce((total, day) => ({
        calories: total.calories + day.totalNutrition.calories,
        protein: total.protein + day.totalNutrition.protein,
        fat: total.fat + day.totalNutrition.fat,
        carbohydrates: total.carbohydrates + day.totalNutrition.carbohydrates,
        fiber: (total.fiber || 0) + (day.totalNutrition.fiber || 0)
    }), getEmptyNutrition())

    // Return average per day
    return {
        calories: Math.round(totalNutrition.calories / 7),
        protein: Math.round(totalNutrition.protein / 7),
        fat: Math.round(totalNutrition.fat / 7),
        carbohydrates: Math.round(totalNutrition.carbohydrates / 7),
        fiber: totalNutrition.fiber ? Math.round(totalNutrition.fiber / 7) : undefined
    }
}

function getEmptyNutrition(): NutritionInfo {
    return {
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0,
        fiber: 0
    }
}

function getRecommendedNutrition(ageInMonths: number): NutritionInfo {
    // Recommended daily nutrition based on Indonesian dietary guidelines for children
    if (ageInMonths < 6) {
        return { calories: 0, protein: 0, fat: 0, carbohydrates: 0 } // Breastfeeding only
    } else if (ageInMonths < 9) {
        return { calories: 200, protein: 8, fat: 8, carbohydrates: 25 } // 6-8 months
    } else if (ageInMonths < 12) {
        return { calories: 300, protein: 10, fat: 12, carbohydrates: 40 } // 9-11 months
    } else if (ageInMonths < 24) {
        return { calories: 550, protein: 15, fat: 20, carbohydrates: 75 } // 12-23 months
    } else {
        return { calories: 1000, protein: 20, fat: 35, carbohydrates: 130 } // 2+ years
    }
}

// Legacy class export for backward compatibility
export const MenuPlanningService = {
    getMenuPlan,
    getWeeklyMenuPlan,
    createOrUpdateMenuPlan,
    addMealToMenuPlan,
    removeMealFromMenuPlan,
    getMenuSuggestions,
    generateWeeklyMenuSuggestions,
    getNutritionSummary,
    getMealTypeDisplayName,
    getMealTypeIcon
}