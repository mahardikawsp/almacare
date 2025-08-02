import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendMPASISuggestion } from '@/lib/server-push-service'

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
        const { userId, childName, recipeName } = body

        if (!userId || !childName || !recipeName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Verify user can send notification to this user ID
        if (session.user.id !== userId) {
            return NextResponse.json(
                { error: 'Cannot send notification to another user' },
                { status: 403 }
            )
        }

        // Send MPASI suggestion push notification
        const result = await sendMPASISuggestion(
            userId,
            childName,
            recipeName
        )

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'MPASI suggestion sent successfully'
            })
        } else {
            return NextResponse.json(
                { error: result.error || 'Failed to send MPASI suggestion' },
                { status: 500 }
            )
        }

    } catch (error) {
        console.error('Error sending MPASI suggestion:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}