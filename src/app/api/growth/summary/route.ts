import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GrowthService } from '@/lib/growth-service'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const childId = searchParams.get('childId')

        if (!childId) {
            return NextResponse.json({
                success: false,
                error: 'Child ID is required'
            }, { status: 400 })
        }

        const summary = await GrowthService.getGrowthSummary(childId)

        return NextResponse.json({
            success: true,
            data: summary
        })
    } catch (error) {
        console.error('Error fetching growth summary:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch growth summary'
        }, { status: 500 })
    }
}