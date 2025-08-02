import webpush from 'web-push'
import { prisma } from '@/lib/prisma'

// Configure VAPID details
webpush.setVapidDetails(
    'mailto:support@bayicare.app',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
)

export interface PushNotificationPayload {
    title: string
    body: string
    icon?: string
    badge?: string
    data?: any
    actions?: Array<{
        action: string
        title: string
    }>
    requireInteraction?: boolean
    silent?: boolean
    vibrate?: number[]
    tag?: string
}

export interface PushNotificationResult {
    success: boolean
    error?: string
}

// Send push notification to a specific user
export async function sendPushNotification(
    userId: string,
    payload: PushNotificationPayload
): Promise<PushNotificationResult> {
    try {
        // Get user's push subscription
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                pushSubscription: true,
                pushEnabled: true,
                name: true
            }
        })

        if (!user) {
            return {
                success: false,
                error: 'User not found'
            }
        }

        if (!user.pushEnabled) {
            return {
                success: false,
                error: 'User has disabled push notifications'
            }
        }

        if (!user.pushSubscription) {
            return {
                success: false,
                error: 'User has not subscribed to push notifications'
            }
        }

        // Prepare notification payload
        const notificationPayload = {
            title: payload.title,
            body: payload.body,
            icon: payload.icon || '/icons/icon-192x192.png',
            badge: payload.badge || '/icons/icon-72x72.png',
            data: payload.data || {},
            actions: payload.actions || [
                {
                    action: 'open',
                    title: 'Buka Aplikasi'
                }
            ],
            requireInteraction: payload.requireInteraction || false,
            silent: payload.silent || false,
            vibrate: payload.vibrate || [200, 100, 200],
            tag: payload.tag || 'bayicare-notification'
        }

        // Send push notification
        await webpush.sendNotification(
            user.pushSubscription as any,
            JSON.stringify(notificationPayload)
        )

        return { success: true }

    } catch (error) {
        console.error('Error sending push notification:', error)

        // Handle specific web-push errors
        if (error && typeof error === 'object' && 'statusCode' in error) {
            const webPushError = error as any

            // If subscription is invalid, disable push notifications for user
            if (webPushError.statusCode === 410 || webPushError.statusCode === 404) {
                try {
                    await prisma.user.update({
                        where: { id: userId },
                        data: {
                            pushSubscription: null,
                            pushEnabled: false
                        }
                    })
                } catch (dbError) {
                    console.error('Error updating user push subscription:', dbError)
                }

                return {
                    success: false,
                    error: 'Push subscription is no longer valid'
                }
            }
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}

// Send push notification to multiple users
export async function sendPushNotificationToUsers(
    userIds: string[],
    payload: PushNotificationPayload
): Promise<{
    totalSent: number
    totalFailed: number
    errors: string[]
}> {
    const results = await Promise.allSettled(
        userIds.map(userId => sendPushNotification(userId, payload))
    )

    let totalSent = 0
    let totalFailed = 0
    const errors: string[] = []

    results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
            totalSent++
        } else {
            totalFailed++
            const error = result.status === 'fulfilled'
                ? result.value.error
                : result.reason?.message || 'Unknown error'
            errors.push(`User ${userIds[index]}: ${error}`)
        }
    })

    return {
        totalSent,
        totalFailed,
        errors
    }
}

// Send immunization reminder push notification
export async function sendImmunizationReminder(
    userId: string,
    childName: string,
    vaccineName: string,
    dueDate: Date
): Promise<PushNotificationResult> {
    const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

    let body: string
    if (daysUntilDue <= 0) {
        body = `Jadwal imunisasi ${vaccineName} untuk ${childName} sudah jatuh tempo. Segera kunjungi fasilitas kesehatan.`
    } else if (daysUntilDue === 1) {
        body = `Besok adalah jadwal imunisasi ${vaccineName} untuk ${childName}. Jangan lupa!`
    } else {
        body = `${daysUntilDue} hari lagi jadwal imunisasi ${vaccineName} untuk ${childName}.`
    }

    return sendPushNotification(userId, {
        title: 'Pengingat Imunisasi',
        body,
        data: {
            type: 'immunization_reminder',
            childName,
            vaccineName,
            dueDate: dueDate.toISOString(),
            url: '/immunization'
        },
        tag: `immunization-${childName}-${vaccineName}`,
        requireInteraction: daysUntilDue <= 0
    })
}

// Send growth alert push notification
export async function sendGrowthAlert(
    userId: string,
    childName: string,
    indicator: string,
    zScore: number
): Promise<PushNotificationResult> {
    const isUnderweight = zScore < -2
    const isOverweight = zScore > 2

    let body: string
    let requireInteraction = false

    if (isUnderweight) {
        body = `${indicator} ${childName} berada di bawah normal (Z-score: ${zScore.toFixed(1)}). Konsultasikan dengan dokter.`
        requireInteraction = true
    } else if (isOverweight) {
        body = `${indicator} ${childName} berada di atas normal (Z-score: ${zScore.toFixed(1)}). Konsultasikan dengan dokter.`
        requireInteraction = true
    } else {
        body = `Data pertumbuhan ${childName} telah diperbarui. ${indicator}: Z-score ${zScore.toFixed(1)}`
    }

    return sendPushNotification(userId, {
        title: isUnderweight || isOverweight ? 'Peringatan Pertumbuhan' : 'Update Pertumbuhan',
        body,
        data: {
            type: 'growth_alert',
            childName,
            indicator,
            zScore,
            url: '/growth'
        },
        tag: `growth-${childName}-${indicator}`,
        requireInteraction
    })
}

// Send MPASI suggestion push notification
export async function sendMPASISuggestion(
    userId: string,
    childName: string,
    recipeName: string
): Promise<PushNotificationResult> {
    return sendPushNotification(userId, {
        title: 'Saran Menu MPASI',
        body: `Coba resep "${recipeName}" untuk ${childName} hari ini!`,
        data: {
            type: 'mpasi_suggestion',
            childName,
            recipeName,
            url: '/mpasi'
        },
        tag: `mpasi-${childName}`
    })
}