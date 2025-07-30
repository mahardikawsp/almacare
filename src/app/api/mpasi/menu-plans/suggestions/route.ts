import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getMenuSuggestions, generateWeeklyMenuSuggestions } from '@/lib/menu-planning-service'
import type { MealType } from '@/types'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const childId = searchParams.get('childId')
        const date = searchParams.get('date')
        const mealType = searchParams.get('mealType')
        const type = searchParams.get('type') // 'meal' or 'weekly'

        if (!childId) {
            return NextResponse.json({ error: 'Child ID is required' }, { status: 400 })
        }

        if (type === 'weekly') {
            if (!date) {
                return NextResponse.json({ error: 'Date is required for weekly suggestions' }, { status: 400 })
            }

            const startDate = new Date(date)
            const weeklyPlan = await generateWeeklyMenuSuggestions(childId, startDate)
            return NextResponse.json(weeklyPlan)
        } else {
            if (!date || !mealType) {
                return NextResponse.json(
                    { error: 'Date and meal type are required for meal suggestions' },
                    { status: 400 }
                )
            }

            const targetDate = new Date(date)
            const suggestions = await getMenuSuggestions(
                childId,
                targetDate,
                mealType as MealType
            )
            return NextResponse.json(suggestions)
        }
    } catch (error) {
        console.error('Error getting menu suggestions:', error)
        return NextResponse.json(
            { error: 'Failed to get menu suggestions' },
            { status: 500 }
        )
    }
}