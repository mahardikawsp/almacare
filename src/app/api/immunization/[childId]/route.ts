import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ImmunizationService } from '@/lib/immunization-service'

// GET /api/immunization/[childId] - Get immunization records for a child
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

        const records = await ImmunizationService.getChildImmunizationRecords(resolvedParams.childId)

        return NextResponse.json({ records })
    } catch (error) {
        console.error('Error fetching immunization records:', error)
        return NextResponse.json(
            { error: 'Failed to fetch immunization records' },
            { status: 500 }
        )
    }
}