import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getNutritionSummary } from '@/lib/menu-planning-service'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const childId = searchParams.get('childId')
        const date = searchParams.get('date')

        if (!childId || !date) {
            return NextResponse.json(
                { error: 'Child ID and date are required' },
                { status: 400 }
            )
        }

        const targetDate = new Date(date)
        const nutritionSummary = await getNutritionSummary(childId, targetDate)

        return NextResponse.json(nutritionSummary)
    } catch (error) {
        console.error('Error getting nutrition summary:', error)
        return NextResponse.json(
            { error: 'Failed to get nutrition summary' },
            { status: 500 }
        )
    }
}