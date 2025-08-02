import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { PushNotificationService } from '@/lib/push-notification-service'

export interface BellNotification {
    id: string
    title: string
    message: string
    type: 'immunization' | 'growth_reminder' | 'mpasi_suggestion' | 'system'
    isRead: boolean
    createdAt: Date
    actionUrl?: string
    childId?: string
}

export interface ToastNotification {
    id: string
    title: string
    description?: string
    type: 'success' | 'error' | 'warning' | 'info'
    duration?: number // in milliseconds, 0 means no auto-hide
    autoHide?: boolean // whether to auto-hide (default: true)
    action?: {
        label: string
        onClick: () => void
    }
}

interface NotificationStore {
    // Bell notifications (persistent)
    bellNotifications: BellNotification[]
    unreadCount: number

    // Toast notifications (temporary)
    toastNotifications: ToastNotification[]

    // Browser push notification settings
    pushNotificationPermission: NotificationPermission | null
    pushSubscription: PushSubscription | null

    // Bell notification actions
    addBellNotification: (notification: BellNotification) => void
    markBellAsRead: (id: string) => void
    clearAllBell: () => void

    // Toast notification actions
    addToastNotification: (notification: ToastNotification) => void
    removeToastNotification: (id: string) => void
    clearAllToast: () => void

    // Push notification actions
    requestPushPermission: () => Promise<boolean>
    subscribeToPush: () => Promise<void>
    unsubscribeFromPush: () => Promise<void>
    setPushPermission: (permission: NotificationPermission) => void
    initializePushNotifications: () => Promise<void>
}

export const useNotificationStore = create<NotificationStore>()(
    devtools(
        (set) => ({
            // Initial state
            bellNotifications: [],
            unreadCount: 0,
            toastNotifications: [],
            pushNotificationPermission: null,
            pushSubscription: null,

            // Bell notification actions
            addBellNotification: (notification) => set((state) => {
                const newNotifications = [notification, ...state.bellNotifications]
                return {
                    bellNotifications: newNotifications,
                    unreadCount: newNotifications.filter(n => !n.isRead).length
                }
            }),

            markBellAsRead: (id) => set((state) => {
                const updatedNotifications = state.bellNotifications.map(notification =>
                    notification.id === id ? { ...notification, isRead: true } : notification
                )
                return {
                    bellNotifications: updatedNotifications,
                    unreadCount: updatedNotifications.filter(n => !n.isRead).length
                }
            }),

            clearAllBell: () => set({
                bellNotifications: [],
                unreadCount: 0
            }),

            // Toast notification actions
            addToastNotification: (notification) => set((state) => ({
                toastNotifications: [...state.toastNotifications, notification]
            })),

            removeToastNotification: (id) => set((state) => ({
                toastNotifications: state.toastNotifications.filter(n => n.id !== id)
            })),

            clearAllToast: () => set({
                toastNotifications: []
            }),

            // Push notification actions
            requestPushPermission: async () => {
                if (!PushNotificationService.isSupported()) {
                    console.warn('Push notifications not supported')
                    return false
                }

                try {
                    const result = await PushNotificationService.requestPermissionAndSubscribe()

                    if (result.success && result.subscription) {
                        set({
                            pushNotificationPermission: 'granted',
                            pushSubscription: result.subscription
                        })
                        return true
                    } else {
                        set({ pushNotificationPermission: 'denied' })
                        console.error('Push permission denied:', result.error)
                        return false
                    }
                } catch (error) {
                    console.error('Error requesting push permission:', error)
                    set({ pushNotificationPermission: 'denied' })
                    return false
                }
            },

            subscribeToPush: async () => {
                if (!PushNotificationService.isSupported()) {
                    console.warn('Push notifications not supported')
                    return
                }

                try {
                    const result = await PushNotificationService.requestPermissionAndSubscribe()

                    if (result.success && result.subscription) {
                        set({
                            pushNotificationPermission: 'granted',
                            pushSubscription: result.subscription
                        })
                    } else {
                        console.error('Failed to subscribe to push notifications:', result.error)
                        throw new Error(result.error || 'Failed to subscribe')
                    }
                } catch (error) {
                    console.error('Error subscribing to push notifications:', error)
                    throw error
                }
            },

            unsubscribeFromPush: async () => {
                if (!PushNotificationService.isSupported()) {
                    console.warn('Push notifications not supported')
                    return
                }

                try {
                    const result = await PushNotificationService.unsubscribe()

                    if (result.success) {
                        set({
                            pushNotificationPermission: 'default',
                            pushSubscription: null
                        })
                    } else {
                        console.error('Failed to unsubscribe from push notifications:', result.error)
                        throw new Error(result.error || 'Failed to unsubscribe')
                    }
                } catch (error) {
                    console.error('Error unsubscribing from push notifications:', error)
                    throw error
                }
            },

            setPushPermission: (permission) => set({
                pushNotificationPermission: permission
            }),

            initializePushNotifications: async () => {
                if (!PushNotificationService.isSupported()) {
                    console.log('Push notifications not supported')
                    return
                }

                try {
                    // Check current permission status
                    const permission = Notification.permission
                    console.log('Current notification permission:', permission)
                    set({ pushNotificationPermission: permission })

                    // If permission is granted, check for existing subscription
                    if (permission === 'granted') {
                        const subscription = await PushNotificationService.getSubscription()
                        console.log('Existing subscription:', subscription ? 'Found' : 'None')
                        set({ pushSubscription: subscription })

                        // If we have a subscription but it's not saved to server, save it
                        if (subscription) {
                            try {
                                const response = await fetch('/api/notifications/subscribe', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ subscription: subscription.toJSON() })
                                })
                                if (!response.ok) {
                                    console.warn('Failed to sync subscription with server')
                                }
                            } catch (error) {
                                console.warn('Error syncing subscription with server:', error)
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error initializing push notifications:', error)
                }
            }
        }),
        { name: 'notification-store' }
    )
)