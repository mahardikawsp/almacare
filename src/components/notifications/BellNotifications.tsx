'use client'

import { useState, useRef, useEffect } from 'react'
import { useNotificationStore } from '@/stores/notificationStore'
import { BellIcon } from '../icons/BellIcon'

export function BellNotifications() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const { bellNotifications, unreadCount, markBellAsRead, clearAllBell } = useNotificationStore()

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'immunization':
                return (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-soft">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                )
            case 'growth_reminder':
                return (
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-500 rounded-2xl flex items-center justify-center shadow-soft">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                )
            case 'mpasi_suggestion':
                return (
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-2xl flex items-center justify-center shadow-soft">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                )
            default:
                return (
                    <div className="w-10 h-10 bg-gradient-to-br from-neutral-400 to-neutral-500 rounded-2xl flex items-center justify-center shadow-soft">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                )
        }
    }

    const formatTime = (date: Date) => {
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffMinutes = Math.ceil(diffTime / (1000 * 60))

        if (diffMinutes < 60) {
            return `${diffMinutes} menit yang lalu`
        } else if (diffMinutes < 1440) {
            const hours = Math.floor(diffMinutes / 60)
            return `${hours} jam yang lalu`
        } else {
            const days = Math.floor(diffMinutes / 1440)
            return `${days} hari yang lalu`
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 text-purple-600 hover:text-pink-700 hover:bg-gradient-to-br hover:from-pink-100/60 hover:to-purple-100/60 rounded-xl transition-all duration-200 hover:scale-105 group"
                aria-label="Notifications"
            >
                <BellIcon className="w-6 h-6 transition-all duration-200 group-hover:rotate-12" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-medium animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gradient-to-b from-white/95 via-pink-50/80 to-blue-50/80 backdrop-blur-lg rounded-2xl shadow-large border border-pink-200/50 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-pink-100/80 via-purple-50/60 to-blue-100/80 border-b border-pink-200/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-soft">
                                    <BellIcon className="w-3 h-3 text-white" />
                                </div>
                                <h3 className="font-semibold text-neutral-900">Notifikasi</h3>
                            </div>
                            {bellNotifications.length > 0 && (
                                <button
                                    type="button"
                                    onClick={clearAllBell}
                                    className="text-xs text-pink-600 hover:text-pink-700 font-semibold px-2 py-1 rounded-lg hover:bg-pink-100/60 transition-colors"
                                >
                                    Hapus Semua
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {bellNotifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-pink-200/60 via-purple-200/60 to-blue-200/60 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                                    <BellIcon className="w-8 h-8 text-neutral-400" />
                                </div>
                                <p className="text-sm font-medium text-neutral-600">Tidak ada notifikasi</p>
                                <p className="text-xs text-neutral-500 mt-1">Notifikasi akan muncul di sini</p>
                            </div>
                        ) : (
                            bellNotifications.map((notification, index) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b border-pink-200/30 hover:bg-gradient-to-r hover:from-pink-50/40 hover:to-purple-50/30 cursor-pointer transition-all duration-200 hover:scale-[1.01] ${!notification.isRead ? 'bg-gradient-to-r from-pink-50/60 via-purple-50/40 to-blue-50/40' : ''
                                        }`}
                                    onClick={() => {
                                        markBellAsRead(notification.id)
                                        if (notification.actionUrl) {
                                            window.location.href = notification.actionUrl
                                        }
                                        setIsOpen(false)
                                    }}
                                    style={{
                                        animationDelay: `${index * 50}ms`
                                    }}
                                >
                                    <div className="flex gap-3">
                                        {getNotificationIcon(notification.type)}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <p className={`text-sm font-semibold ${!notification.isRead ? 'text-neutral-900' : 'text-neutral-700'
                                                    }`}>
                                                    {notification.title}
                                                </p>
                                                {!notification.isRead && (
                                                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full flex-shrink-0 mt-1 animate-pulse" />
                                                )}
                                            </div>
                                            <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-neutral-500 mt-2 font-medium">
                                                {formatTime(notification.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}