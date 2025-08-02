import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        // Verify user can only access their own data
        if (userId && userId !== session.user.id) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            )
        }

        // Get all children for the user
        const children = await prisma.child.findMany({
            where: {
                userId: session.user.id
            },
            select: {
                id: true,
                name: true
            }
        })

        if (children.length === 0) {
            return NextResponse.json({
                success: true,
                data: [],
                message: 'No children found'
            })
        }

        // Get latest growth record for each child (more efficient)
        const growthRecords = await prisma.growthRecord.findMany({
            where: {
                childId: {
                    in: children.map(child => child.id)
                }
            },
            orderBy: {
                date: 'desc'
            },
            take: 50, // Limit to prevent large responses
            select: {
                id: true,
                childId: true,
                date: true,
                weight: true,
                height: true,
                headCircumference: true,
                weightForAgeZScore: true,
                heightForAgeZScore: true,
                weightForHeightZScore: true,
                headCircumferenceZScore: true,
                child: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            data: growthRecords,
            childrenCount: children.length
        })

    } catch (error) {
        console.error('Error fetching growth summary:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch growth summary'
            },
            { status: 500 }
        )
    }
}