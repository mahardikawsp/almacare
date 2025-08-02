import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Remove push subscription from user
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                pushSubscription: null,
                pushEnabled: false
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Push notification subscription removed successfully'
        })

    } catch (error) {
        console.error('Error removing push subscription:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}