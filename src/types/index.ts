// Import Prisma types
import type {
    User,
    Child,
    GrowthRecord,
    ImmunizationSchedule,
    ImmunizationRecord,
    MPASIRecipe,
    MPASIFavorite,
    MPASIMenuPlan,
    MPASIMeal,
    Gender,
    ImmunizationStatus,
    Texture,
    MealType
} from '@prisma/client'

// Re-export Prisma types for convenience
export type {
    User,
    Child,
    GrowthRecord,
    ImmunizationSchedule,
    ImmunizationRecord,
    MPASIRecipe,
    MPASIFavorite,
    MPASIMenuPlan,
    MPASIMeal,
    Gender,
    ImmunizationStatus,
    Texture,
    MealType
} from '@prisma/client'

// Extended types for the application
export interface ChildWithRecords extends Child {
    growthRecords: GrowthRecord[]
    immunizationRecords: ImmunizationRecord[]
    mpasiFavorites: MPASIFavorite[]
}

export interface UserWithChildren extends User {
    children: Child[]
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

// Growth tracking types
export interface GrowthStatus {
    indicator: string
    zScore: number
    status: 'normal' | 'warning' | 'alert'
    message: string
}

export interface GrowthAnalysis {
    weightForAge: GrowthStatus
    heightForAge: GrowthStatus
    weightForHeight: GrowthStatus
    headCircumferenceForAge?: GrowthStatus
}

// MPASI types
export interface Ingredient {
    name: string
    amount: string
    unit: string
}

export interface NutritionInfo {
    calories: number
    protein: number
    fat: number
    carbohydrates: number
    fiber?: number
    vitamins?: Record<string, number>
    minerals?: Record<string, number>
}

export interface MPASIRecipeWithDetails extends Omit<MPASIRecipe, 'ingredients' | 'instructions' | 'nutrition'> {
    ingredients: Ingredient[]
    instructions: string[]
    nutrition: NutritionInfo
    isFavorite?: boolean
}

// Menu Planning types
export interface MPASIMenuPlanWithMeals extends MPASIMenuPlan {
    meals: MPASIMealWithRecipe[]
}

export interface MPASIMealWithRecipe extends MPASIMeal {
    recipe: MPASIRecipeWithDetails
}

export interface DailyMenuPlan {
    date: Date
    meals: {
        [K in MealType]?: MPASIMealWithRecipe
    }
    totalNutrition: NutritionInfo
}

export interface WeeklyMenuPlan {
    startDate: Date
    endDate: Date
    days: DailyMenuPlan[]
    weeklyNutrition: NutritionInfo
}

export interface MenuSuggestion {
    mealType: MealType
    recipes: MPASIRecipeWithDetails[]
    reason: string
}

export interface NutritionSummary {
    daily: NutritionInfo
    recommended: NutritionInfo
    percentage: {
        calories: number
        protein: number
        fat: number
        carbohydrates: number
    }
}

// Notification types
export interface BellNotification {
    id: string
    title: string
    message: string
    type: 'immunization' | 'growth_reminder' | 'mpasi_suggestion' | 'system'
    isRead: boolean
    createdAt: Date
    actionUrl?: string
    childId?: string
}

export interface ToastNotification {
    id: string
    title: string
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    duration: number
    autoHide: boolean
    actionButton?: {
        label: string
        action: () => void
    }
}

// Form types
export interface CreateChildForm {
    name: string
    gender: Gender
    birthDate: string
    relationship: string
}

export interface GrowthRecordForm {
    date: string
    weight: number
    height: number
    headCircumference?: number
}

// Chart data types
export interface ChartDataPoint {
    date: string
    value: number
    zScore?: number
    status?: 'normal' | 'warning' | 'alert'
}

export interface GrowthChartData {
    weightForAge: ChartDataPoint[]
    heightForAge: ChartDataPoint[]
    weightForHeight: ChartDataPoint[]
    headCircumferenceForAge?: ChartDataPoint[]
}

// WHO Standards types
export interface WHOStandard {
    ageInMonths: number
    L: number
    M: number
    S: number
}

export interface WHOStandardsData {
    weightForAge: WHOStandard[]
    heightForAge: WHOStandard[]
    weightForHeight: WHOStandard[]
    headCircumferenceForAge: WHOStandard[]
}

// Immunization types
export interface ImmunizationRecordWithSchedule extends ImmunizationRecord {
    schedule: ImmunizationSchedule
}

export interface ImmunizationCalendarItem {
    id: string
    vaccineName: string
    vaccineType: string
    scheduledDate: Date
    actualDate?: Date
    status: ImmunizationStatus
    notes?: string
    isOptional: boolean
    isOverdue: boolean
    description?: string
    daysUntilDue?: number
}

// Session types (extending NextAuth)
declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            name?: string | null
            email?: string | null
            image?: string | null
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        uid: string
    }
}