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

        // Parse request body
        const body = await request.json()
        const { subscription } = body

        if (!subscription) {
            return NextResponse.json(
                { error: 'Subscription data is required' },
                { status: 400 }
            )
        }

        // Validate subscription object
        if (!subscription.endpoint || !subscription.keys) {
            return NextResponse.json(
                { error: 'Invalid subscription data' },
                { status: 400 }
            )
        }

        // Update user with push subscription
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                pushSubscription: subscription,
                pushEnabled: true
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Push notification subscription saved successfully'
        })

    } catch (error) {
        console.error('Error saving push subscription:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}