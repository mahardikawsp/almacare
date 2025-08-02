import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'

export async function GET(request: NextRequest) {
    try {
        // Test VAPID key configuration
        const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        const privateKey = process.env.VAPID_PRIVATE_KEY

        const results = {
            vapidKeysConfigured: {
                publicKey: !!publicKey,
                privateKey: !!privateKey,
                publicKeyLength: publicKey?.length || 0,
                privateKeyLength: privateKey?.length || 0,
                publicKeyPreview: publicKey ? `${publicKey.substring(0, 20)}...` : 'Not set'
            },
            webPushConfiguration: {
                configured: false,
                error: null as string | null
            },
            keyValidation: {
                publicKeyValid: false,
                privateKeyValid: false,
                keysMatch: false,
                error: null as string | null
            }
        }

        // Check if keys are present
        if (!publicKey || !privateKey) {
            return NextResponse.json({
                success: false,
                error: 'VAPID keys not configured',
                results
            })
        }

        // Test web-push configuration
        try {
            webpush.setVapidDetails(
                'mailto:support@bayicare.app',
                publicKey,
                privateKey
            )
            results.webPushConfiguration.configured = true
        } catch (error) {
            results.webPushConfiguration.error = error instanceof Error ? error.message : 'Unknown error'
        }

        // Validate key format and compatibility
        try {
            // Check public key format (should be base64url encoded, 65 bytes when decoded)
            const publicKeyBuffer = Buffer.from(publicKey.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
            results.keyValidation.publicKeyValid = publicKeyBuffer.length === 65

            // Check private key format (should be base64url encoded, 32 bytes when decoded)
            const privateKeyBuffer = Buffer.from(privateKey.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
            results.keyValidation.privateKeyValid = privateKeyBuffer.length === 32

            // Keys are considered matching if both are valid format
            results.keyValidation.keysMatch = results.keyValidation.publicKeyValid && results.keyValidation.privateKeyValid

        } catch (error) {
            results.keyValidation.error = error instanceof Error ? error.message : 'Key validation error'
        }

        const allTestsPassed =
            results.vapidKeysConfigured.publicKey &&
            results.vapidKeysConfigured.privateKey &&
            results.webPushConfiguration.configured &&
            results.keyValidation.publicKeyValid &&
            results.keyValidation.privateKeyValid

        return NextResponse.json({
            success: allTestsPassed,
            message: allTestsPassed ? 'VAPID configuration is valid' : 'VAPID configuration has issues',
            results,
            recommendations: allTestsPassed ? [] : [
                !results.vapidKeysConfigured.publicKey && 'Set NEXT_PUBLIC_VAPID_PUBLIC_KEY in .env',
                !results.vapidKeysConfigured.privateKey && 'Set VAPID_PRIVATE_KEY in .env',
                !results.keyValidation.publicKeyValid && 'Public key format is invalid',
                !results.keyValidation.privateKeyValid && 'Private key format is invalid',
                !results.webPushConfiguration.configured && 'Web-push library configuration failed'
            ].filter(Boolean)
        })

    } catch (error) {
        console.error('Error testing VAPID configuration:', error)
        return NextResponse.json({
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        // Test sending a notification with current VAPID keys
        const body = await request.json()
        const { subscription } = body

        if (!subscription) {
            return NextResponse.json({
                success: false,
                error: 'Test subscription required'
            }, { status: 400 })
        }

        const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        const privateKey = process.env.VAPID_PRIVATE_KEY

        if (!publicKey || !privateKey) {
            return NextResponse.json({
                success: false,
                error: 'VAPID keys not configured'
            }, { status: 500 })
        }

        // Configure web-push
        webpush.setVapidDetails(
            'mailto:support@bayicare.app',
            publicKey,
            privateKey
        )

        // Test notification payload
        const payload = JSON.stringify({
            title: 'VAPID Test Notification',
            body: 'This is a test to verify VAPID keys are working correctly!',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            data: {
                type: 'vapid_test',
                timestamp: Date.now()
            }
        })

        // Send test notification
        const result = await webpush.sendNotification(subscription, payload)

        return NextResponse.json({
            success: true,
            message: 'VAPID test notification sent successfully',
            details: {
                statusCode: result.statusCode,
                headers: result.headers,
                body: result.body
            }
        })

    } catch (error) {
        console.error('Error sending VAPID test notification:', error)

        // Handle specific web-push errors
        if (error && typeof error === 'object' && 'statusCode' in error) {
            const webPushError = error as any
            return NextResponse.json({
                success: false,
                error: 'Web-push error',
                details: {
                    statusCode: webPushError.statusCode,
                    message: webPushError.body || webPushError.message,
                    headers: webPushError.headers
                }
            }, { status: 400 })
        }

        return NextResponse.json({
            success: false,
            error: 'Failed to send test notification',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}