import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getMenuPlan, getWeeklyMenuPlan, createOrUpdateMenuPlan } from '@/lib/menu-planning-service'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const childId = searchParams.get('childId')
        const date = searchParams.get('date')
        const type = searchParams.get('type') // 'daily' or 'weekly'

        if (!childId) {
            return NextResponse.json({ error: 'Child ID is required' }, { status: 400 })
        }

        if (!date) {
            return NextResponse.json({ error: 'Date is required' }, { status: 400 })
        }

        const targetDate = new Date(date)

        if (type === 'weekly') {
            const weeklyPlan = await getWeeklyMenuPlan(childId, targetDate)
            return NextResponse.json(weeklyPlan)
        } else {
            const dailyPlan = await getMenuPlan(childId, targetDate)
            return NextResponse.json(dailyPlan)
        }
    } catch (error) {
        console.error('Error fetching menu plan:', error)
        return NextResponse.json(
            { error: 'Failed to fetch menu plan' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { childId, date, meals } = body

        if (!childId || !date || !meals) {
            return NextResponse.json(
                { error: 'Child ID, date, and meals are required' },
                { status: 400 }
            )
        }

        const targetDate = new Date(date)
        const menuPlan = await createOrUpdateMenuPlan(
            childId,
            targetDate,
            meals
        )

        return NextResponse.json(menuPlan, { status: 201 })
    } catch (error) {
        console.error('Error creating menu plan:', error)
        return NextResponse.json(
            { error: 'Failed to create menu plan' },
            { status: 500 }
        )
    }
}