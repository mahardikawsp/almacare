import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ImmunizationService } from '@/lib/immunization-service'

// GET /api/immunization/[childId]/calendar - Get immunization calendar for a child
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ childId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const resolvedParams = await params

        // Verify child belongs to user
        const child = await prisma.child.findFirst({
            where: {
                id: resolvedParams.childId,
                userId: session.user.id
            }
        })

        if (!child) {
            return NextResponse.json(
                { error: 'Child not found or access denied' },
                { status: 404 }
            )
        }

        // Get query parameters for year and month filtering
        const { searchParams } = new URL(request.url)
        const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined
        const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined

        const calendarItems = await ImmunizationService.getImmunizationCalendar(
            resolvedParams.childId,
            year,
            month
        )

        return NextResponse.json({ calendar: calendarItems })
    } catch (error) {
        console.error('Error fetching immunization calendar:', error)
        return NextResponse.json(
            { error: 'Failed to fetch immunization calendar' },
            { status: 500 }
        )
    }
}