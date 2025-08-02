import { useNotificationStore, BellNotification, ToastNotification } from '@/stores/notificationStore'
import { sendPushNotification, sendImmunizationReminder, sendGrowthAlert, sendMPASISuggestion } from '@/lib/server-push-service'

// Client-side notification service
export class NotificationService {
    // Generate unique ID for notifications
    private static generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    // Add bell notification (in-app persistent notification)
    static addBellNotification(notification: Omit<BellNotification, 'id' | 'createdAt'>) {
        const store = useNotificationStore.getState()
        store.addBellNotification({
            ...notification,
            id: this.generateId(),
            createdAt: new Date()
        })
    }

    // Add toast notification (temporary notification)
    static addToastNotification(notification: Omit<ToastNotification, 'id'>) {
        const store = useNotificationStore.getState()
        store.addToastNotification({
            ...notification,
            id: this.generateId()
        })
    }

    // Schedule immunization reminder (bell + toast + push)
    static async scheduleImmunizationReminder(
        childId: string,
        childName: string,
        vaccine: string,
        date: Date,
        userId?: string
    ) {
        const threeDaysBefore = new Date(date)
        threeDaysBefore.setDate(threeDaysBefore.getDate() - 3)

        const daysUntilDue = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

        // Determine message based on days until due
        let message: string
        let toastType: 'warning' | 'error' | 'info' = 'info'

        if (daysUntilDue <= 0) {
            message = `Jadwal imunisasi ${vaccine} untuk ${childName} sudah jatuh tempo!`
            toastType = 'error'
        } else if (daysUntilDue <= 3) {
            message = `${childName} perlu imunisasi ${vaccine} dalam ${daysUntilDue} hari`
            toastType = 'warning'
        } else {
            message = `Jadwal imunisasi ${vaccine} untuk ${childName} pada ${date.toLocaleDateString('id-ID')}`
            toastType = 'info'
        }

        // Add bell notification
        this.addBellNotification({
            title: 'Jadwal Imunisasi',
            message,
            type: 'immunization',
            isRead: false,
            childId,
            actionUrl: `/immunization/${childId}`
        })

        // Add toast notification if urgent
        if (daysUntilDue <= 3) {
            this.addToastNotification({
                title: 'Pengingat Imunisasi',
                description: message,
                type: toastType,
                duration: daysUntilDue <= 0 ? 0 : 8000, // Don't auto-hide if overdue
                autoHide: daysUntilDue > 0,
                action: daysUntilDue <= 0 ? {
                    label: 'Lihat Jadwal',
                    onClick: () => window.location.href = `/immunization/${childId}`
                } : undefined
            })
        }

        // Send push notification if user ID is provided
        if (userId) {
            try {
                await fetch('/api/notifications/immunization-reminder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        childName,
                        vaccineName: vaccine,
                        dueDate: date.toISOString()
                    })
                })
            } catch (error) {
                console.error('Failed to send push notification:', error)
            }
        }
    }

    // Notify growth alert (bell + toast + push)
    static async notifyGrowthAlert(
        childId: string,
        childName: string,
        indicator: string,
        zScore: number,
        userId?: string
    ) {
        const isAbnormal = zScore < -2 || zScore > 2
        const isUnderweight = zScore < -2
        const isOverweight = zScore > 2

        let title: string
        let message: string
        let toastType: 'success' | 'warning' | 'error' = 'success'

        if (isUnderweight) {
            title = 'Peringatan Pertumbuhan'
            message = `${indicator} ${childName} di bawah normal (Z-score: ${zScore.toFixed(1)}). Konsultasikan dengan dokter.`
            toastType = 'error'
        } else if (isOverweight) {
            title = 'Peringatan Pertumbuhan'
            message = `${indicator} ${childName} di atas normal (Z-score: ${zScore.toFixed(1)}). Konsultasikan dengan dokter.`
            toastType = 'error'
        } else {
            title = 'Update Pertumbuhan'
            message = `${indicator} ${childName} dalam rentang normal (Z-score: ${zScore.toFixed(1)})`
            toastType = 'success'
        }

        // Add bell notification
        this.addBellNotification({
            title,
            message,
            type: 'growth_reminder',
            isRead: false,
            childId,
            actionUrl: `/growth/${childId}`
        })

        // Add toast notification
        this.addToastNotification({
            title,
            description: message,
            type: toastType,
            duration: isAbnormal ? 0 : 5000, // Don't auto-hide if abnormal
            autoHide: !isAbnormal,
            action: isAbnormal ? {
                label: 'Lihat Detail',
                onClick: () => window.location.href = `/growth/${childId}`
            } : undefined
        })

        // Send push notification if user ID is provided and growth is abnormal
        if (userId && isAbnormal) {
            try {
                await fetch('/api/notifications/growth-alert', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        childName,
                        indicator,
                        zScore
                    })
                })
            } catch (error) {
                console.error('Failed to send push notification:', error)
            }
        }
    }

    // Suggest MPASI recipe (bell + toast + push)
    static async suggestMPASIRecipe(
        childId: string,
        childName: string,
        recipeName: string,
        userId?: string
    ) {
        const message = `Coba resep "${recipeName}" untuk ${childName} hari ini!`

        // Add bell notification
        this.addBellNotification({
            title: 'Saran Menu MPASI',
            message,
            type: 'mpasi_suggestion',
            isRead: false,
            childId,
            actionUrl: `/mpasi?recipe=${encodeURIComponent(recipeName)}`
        })

        // Add toast notification
        this.addToastNotification({
            title: 'Saran Menu MPASI',
            description: message,
            type: 'info',
            duration: 6000,
            autoHide: true,
            action: {
                label: 'Lihat Resep',
                onClick: () => window.location.href = `/mpasi?recipe=${encodeURIComponent(recipeName)}`
            }
        })

        // Send push notification if user ID is provided
        if (userId) {
            try {
                await fetch('/api/notifications/mpasi-suggestion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        childName,
                        recipeName
                    })
                })
            } catch (error) {
                console.error('Failed to send push notification:', error)
            }
        }
    }

    // Send system notification
    static addSystemNotification(
        title: string,
        message: string,
        type: 'success' | 'warning' | 'error' | 'info' = 'info',
        actionUrl?: string
    ) {
        // Add bell notification
        this.addBellNotification({
            title,
            message,
            type: 'system',
            isRead: false,
            actionUrl
        })

        // Add toast notification
        this.addToastNotification({
            title,
            description: message,
            type,
            duration: type === 'error' ? 8000 : 5000,
            autoHide: true
        })
    }

    // Clear all notifications
    static clearAllNotifications() {
        const store = useNotificationStore.getState()
        store.clearAllBell()
        store.clearAllToast()
    }

    // Mark all bell notifications as read
    static markAllBellNotificationsAsRead() {
        const store = useNotificationStore.getState()
        store.bellNotifications.forEach(notification => {
            if (!notification.isRead) {
                store.markBellAsRead(notification.id)
            }
        })
    }
}