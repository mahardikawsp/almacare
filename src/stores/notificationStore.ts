import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

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
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    duration: number
    autoHide: boolean
    actionButton?: {
        label: string
        action: () => void
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
                if (!('Notification' in window) || !('serviceWorker' in navigator)) {
                    console.warn('Push notifications not supported')
                    return false
                }

                try {
                    const permission = await Notification.requestPermission()
                    set({ pushNotificationPermission: permission })
                    return permission === 'granted'
                } catch (error) {
                    console.error('Error requesting push permission:', error)
                    return false
                }
            },

            subscribeToPush: async () => {
                // TODO: Implement push subscription (will be implemented in task 13)
                console.log('Push subscription not yet implemented')
            },

            unsubscribeFromPush: async () => {
                // TODO: Implement push unsubscription (will be implemented in task 13)
                console.log('Push unsubscription not yet implemented')
            },

            setPushPermission: (permission) => set({
                pushNotificationPermission: permission
            })
        }),
        { name: 'notification-store' }
    )
)