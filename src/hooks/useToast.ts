'use client'

import { useCallback } from 'react'
import { useNotificationStore, type ToastNotification } from '@/stores/notificationStore'

// Generate unique ID for notifications
function generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// Default durations for different toast types (in milliseconds)
const DEFAULT_DURATIONS = {
    success: 4000,
    info: 5000,
    warning: 6000,
    error: 8000,
} as const

export interface ToastOptions {
    duration?: number
    autoHide?: boolean
    action?: {
        label: string
        onClick: () => void
    }
}

export function useToast() {
    const { addToastNotification } = useNotificationStore()

    const toast = useCallback((
        type: ToastNotification['type'],
        title: string,
        description?: string,
        options?: ToastOptions
    ) => {
        const id = generateId()
        const duration = options?.duration ?? DEFAULT_DURATIONS[type]
        const autoHide = options?.autoHide ?? true

        addToastNotification({
            id,
            type,
            title,
            description,
            duration: autoHide ? duration : 0,
            autoHide,
            action: options?.action
        })

        return id
    }, [addToastNotification])

    const success = useCallback((
        title: string,
        description?: string,
        options?: ToastOptions
    ) => {
        return toast('success', title, description, options)
    }, [toast])

    const error = useCallback((
        title: string,
        description?: string,
        options?: ToastOptions
    ) => {
        return toast('error', title, description, options)
    }, [toast])

    const warning = useCallback((
        title: string,
        description?: string,
        options?: ToastOptions
    ) => {
        return toast('warning', title, description, options)
    }, [toast])

    const info = useCallback((
        title: string,
        description?: string,
        options?: ToastOptions
    ) => {
        return toast('info', title, description, options)
    }, [toast])

    const dismiss = useCallback((id: string) => {
        const { removeToastNotification } = useNotificationStore.getState()
        removeToastNotification(id)
    }, [])

    const dismissAll = useCallback(() => {
        const { clearAllToast } = useNotificationStore.getState()
        clearAllToast()
    }, [])

    return {
        toast,
        success,
        error,
        warning,
        info,
        dismiss,
        dismissAll
    }
}

// Standalone notification functions that can be used outside of React components
export const toast = {
    success: (title: string, description?: string, options?: ToastOptions) => {
        const { addToastNotification } = useNotificationStore.getState()
        const id = generateId()
        const duration = options?.duration ?? DEFAULT_DURATIONS.success
        const autoHide = options?.autoHide ?? true

        addToastNotification({
            id,
            type: 'success',
            title,
            description,
            duration: autoHide ? duration : 0,
            autoHide,
            action: options?.action
        })

        return id
    },

    error: (title: string, description?: string, options?: ToastOptions) => {
        const { addToastNotification } = useNotificationStore.getState()
        const id = generateId()
        const duration = options?.duration ?? DEFAULT_DURATIONS.error
        const autoHide = options?.autoHide ?? true

        addToastNotification({
            id,
            type: 'error',
            title,
            description,
            duration: autoHide ? duration : 0,
            autoHide,
            action: options?.action
        })

        return id
    },

    warning: (title: string, description?: string, options?: ToastOptions) => {
        const { addToastNotification } = useNotificationStore.getState()
        const id = generateId()
        const duration = options?.duration ?? DEFAULT_DURATIONS.warning
        const autoHide = options?.autoHide ?? true

        addToastNotification({
            id,
            type: 'warning',
            title,
            description,
            duration: autoHide ? duration : 0,
            autoHide,
            action: options?.action
        })

        return id
    },

    info: (title: string, description?: string, options?: ToastOptions) => {
        const { addToastNotification } = useNotificationStore.getState()
        const id = generateId()
        const duration = options?.duration ?? DEFAULT_DURATIONS.info
        const autoHide = options?.autoHide ?? true

        addToastNotification({
            id,
            type: 'info',
            title,
            description,
            duration: autoHide ? duration : 0,
            autoHide,
            action: options?.action
        })

        return id
    },

    dismiss: (id: string) => {
        const { removeToastNotification } = useNotificationStore.getState()
        removeToastNotification(id)
    },

    dismissAll: () => {
        const { clearAllToast } = useNotificationStore.getState()
        clearAllToast()
    }
}