'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { SuccessToast, ErrorToast, WarningToast, InfoToast, ToastAction } from '@/components/ui/Toast'
import { useNotificationStore, type ToastNotification } from '@/stores/notificationStore'

interface ToastItemProps {
    notification: ToastNotification
    onRemove: (id: string) => void
}

function ToastItem({ notification, onRemove }: ToastItemProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false)

    useEffect(() => {
        // Trigger slide-down animation on mount
        const timer = setTimeout(() => setIsVisible(true), 10)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (notification.duration && notification.duration > 0) {
            const timer = setTimeout(() => {
                handleRemove()
            }, notification.duration)

            return () => clearTimeout(timer)
        }
    }, [notification.duration, notification.id])

    const handleRemove = () => {
        setIsRemoving(true)
        // Small delay to allow exit animation
        setTimeout(() => {
            onRemove(notification.id)
        }, 300)
    }

    const commonProps = {
        title: notification.title,
        description: notification.description,
        onClose: handleRemove,
        action: notification.action ? (
            <ToastAction onClick={notification.action.onClick}>
                {notification.action.label}
            </ToastAction>
        ) : undefined
    }

    const toastComponent = (() => {
        switch (notification.type) {
            case 'success':
                return <SuccessToast {...commonProps} />
            case 'error':
                return <ErrorToast {...commonProps} />
            case 'warning':
                return <WarningToast {...commonProps} />
            case 'info':
                return <InfoToast {...commonProps} />
            default:
                return <InfoToast {...commonProps} />
        }
    })()

    return (
        <div
            className={`
                transform transition-all duration-300 ease-out overflow-hidden
                ${isVisible && !isRemoving
                    ? 'translate-y-0 opacity-100 scale-100 max-h-96'
                    : isRemoving
                        ? '-translate-y-2 opacity-0 scale-95 max-h-0 mb-0'
                        : '-translate-y-8 opacity-0 scale-95 max-h-0'
                }
            `}
            style={{
                marginBottom: isRemoving ? '0' : '0.5rem'
            }}
        >
            {toastComponent}
        </div>
    )
}

export function ToastContainer() {
    const { toastNotifications, removeToastNotification } = useNotificationStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const toastContainer = (
        <div className="fixed top-safe-top left-4 right-4 sm:top-4 sm:right-4 sm:left-auto z-50 max-w-full sm:max-w-md w-full sm:w-auto pointer-events-none">
            <div className="space-y-2 sm:space-y-3">
                {toastNotifications.map((notification) => (
                    <div key={notification.id} className="pointer-events-auto">
                        <ToastItem
                            notification={notification}
                            onRemove={removeToastNotification}
                        />
                    </div>
                ))}
            </div>
        </div>
    )

    return createPortal(toastContainer, document.body)
}