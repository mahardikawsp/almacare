// Push Notification Service for BayiCare
export class PushNotificationService {
    private static vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

    // Check if push notifications are supported
    static isSupported(): boolean {
        return (
            typeof window !== 'undefined' &&
            'Notification' in window &&
            'serviceWorker' in navigator &&
            'PushManager' in window
        )
    }

    // Request permission and subscribe to push notifications
    static async requestPermissionAndSubscribe(): Promise<{
        success: boolean
        subscription?: PushSubscription
        error?: string
    }> {
        if (!this.isSupported()) {
            return {
                success: false,
                error: 'Push notifications not supported in this browser'
            }
        }

        try {
            // Request notification permission
            const permission = await Notification.requestPermission()

            if (permission !== 'granted') {
                return {
                    success: false,
                    error: 'Notification permission denied'
                }
            }

            // Register service worker if not already registered
            let registration = await navigator.serviceWorker.getRegistration()
            if (!registration) {
                registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                })
                await navigator.serviceWorker.ready
            }

            // Subscribe to push notifications
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
            })

            // Save subscription to server
            const saveResult = await this.saveSubscription(subscription)

            if (!saveResult.success) {
                return {
                    success: false,
                    error: saveResult.error || 'Failed to save subscription'
                }
            }

            return {
                success: true,
                subscription
            }
        } catch (error) {
            console.error('Error requesting push permission:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }
        }
    }

    // Get existing subscription
    static async getSubscription(): Promise<PushSubscription | null> {
        if (!this.isSupported()) {
            return null
        }

        try {
            const registration = await navigator.serviceWorker.getRegistration()
            if (!registration) {
                return null
            }

            return await registration.pushManager.getSubscription()
        } catch (error) {
            console.error('Error getting push subscription:', error)
            return null
        }
    }

    // Unsubscribe from push notifications
    static async unsubscribe(): Promise<{ success: boolean; error?: string }> {
        if (!this.isSupported()) {
            return {
                success: false,
                error: 'Push notifications not supported'
            }
        }

        try {
            const registration = await navigator.serviceWorker.getRegistration()
            if (!registration) {
                return { success: true } // Already unsubscribed
            }

            const subscription = await registration.pushManager.getSubscription()
            if (!subscription) {
                return { success: true } // Already unsubscribed
            }

            // Unsubscribe from push manager
            const unsubscribed = await subscription.unsubscribe()

            if (unsubscribed) {
                // Remove subscription from server
                await this.removeSubscription()
                return { success: true }
            } else {
                return {
                    success: false,
                    error: 'Failed to unsubscribe from push notifications'
                }
            }
        } catch (error) {
            console.error('Error unsubscribing from push notifications:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }
        }
    }

    // Save subscription to server
    private static async saveSubscription(subscription: PushSubscription): Promise<{
        success: boolean
        error?: string
    }> {
        try {
            console.log('Saving push subscription to server...', {
                endpoint: subscription.endpoint,
                hasKeys: !!subscription.keys
            })

            const response = await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscription: subscription.toJSON()
                })
            })

            const responseData = await response.json()
            console.log('Save subscription response:', responseData)

            if (!response.ok) {
                return {
                    success: false,
                    error: responseData.error || `HTTP ${response.status}: ${response.statusText}`
                }
            }

            return { success: true }
        } catch (error) {
            console.error('Error saving push subscription:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error'
            }
        }
    }

    // Remove subscription from server
    private static async removeSubscription(): Promise<{
        success: boolean
        error?: string
    }> {
        try {
            const response = await fetch('/api/notifications/unsubscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                return {
                    success: false,
                    error: errorData.error || `HTTP ${response.status}: ${response.statusText}`
                }
            }

            return { success: true }
        } catch (error) {
            console.error('Error removing push subscription:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error'
            }
        }
    }

    // Convert VAPID key from base64 to Uint8Array
    private static urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = '='.repeat((4 - base64String.length % 4) % 4)
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/')

        const rawData = window.atob(base64)
        const outputArray = new Uint8Array(rawData.length)

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i)
        }
        return outputArray
    }

    // Test push notification (for development/testing)
    static async testPushNotification(): Promise<{
        success: boolean
        error?: string
    }> {
        try {
            const response = await fetch('/api/notifications/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                return {
                    success: false,
                    error: errorData.error || `HTTP ${response.status}: ${response.statusText}`
                }
            }

            return { success: true }
        } catch (error) {
            console.error('Error sending test push notification:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error'
            }
        }
    }
}