import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { addMealToMenuPlan, removeMealFromMenuPlan } from '@/lib/menu-planning-service'
import type { MealType } from '@/types'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { childId, date, mealType, recipeId, notes } = body

        if (!childId || !date || !mealType || !recipeId) {
            return NextResponse.json(
                { error: 'Child ID, date, meal type, and recipe ID are required' },
                { status: 400 }
            )
        }

        const targetDate = new Date(date)
        const menuPlan = await addMealToMenuPlan(
            childId,
            targetDate,
            mealType as MealType,
            recipeId,
            notes
        )

        return NextResponse.json(menuPlan, { status: 201 })
    } catch (error) {
        console.error('Error adding meal to menu plan:', error)
        return NextResponse.json(
            { error: 'Failed to add meal to menu plan' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const childId = searchParams.get('childId')
        const date = searchParams.get('date')
        const mealType = searchParams.get('mealType')

        if (!childId || !date || !mealType) {
            return NextResponse.json(
                { error: 'Child ID, date, and meal type are required' },
                { status: 400 }
            )
        }

        const targetDate = new Date(date)
        const menuPlan = await removeMealFromMenuPlan(
            childId,
            targetDate,
            mealType as MealType
        )

        return NextResponse.json(menuPlan)
    } catch (error) {
        console.error('Error removing meal from menu plan:', error)
        return NextResponse.json(
            { error: 'Failed to remove meal from menu plan' },
            { status: 500 }
        )
    }
}