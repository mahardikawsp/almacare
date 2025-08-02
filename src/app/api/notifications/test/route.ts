import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendPushNotification } from '@/lib/server-push-service'

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

        console.log('Sending test push notification to user:', session.user.id)

        // Send test push notification
        const result = await sendPushNotification(session.user.id, {
            title: 'Test Notifikasi BayiCare',
            body: 'Ini adalah test notifikasi push. Sistem notifikasi berfungsi dengan baik!',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            data: {
                url: '/dashboard',
                type: 'test'
            }
        })

        console.log('Test notification result:', result)

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'Test push notification sent successfully'
            })
        } else {
            console.error('Failed to send test notification:', result.error)
            return NextResponse.json(
                {
                    error: result.error || 'Failed to send test notification',
                    details: 'Check server logs for more information'
                },
                { status: 500 }
            )
        }

    } catch (error) {
        console.error('Error sending test push notification:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}