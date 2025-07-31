'use client'

import { useState, useEffect } from 'react'
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export type SyncState = 'idle' | 'syncing' | 'success' | 'error'

interface SyncStatusProps {
    className?: string
}

export function SyncStatus({ className = '' }: SyncStatusProps) {
    const [syncState, setSyncState] = useState<SyncState>('idle')
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
    const [pendingChanges, setPendingChanges] = useState(0)

    useEffect(() => {
        // Listen for online/offline events
        const handleOnline = () => {
            if (pendingChanges > 0) {
                startSync()
            }
        }

        const handleOffline = () => {
            setSyncState('idle')
        }

        // Listen for custom sync events
        const handleSyncStart = () => {
            setSyncState('syncing')
        }

        const handleSyncSuccess = () => {
            setSyncState('success')
            setLastSyncTime(new Date())
            setPendingChanges(0)
            // Reset to idle after 2 seconds
            setTimeout(() => setSyncState('idle'), 2000)
        }

        const handleSyncError = () => {
            setSyncState('error')
            // Reset to idle after 3 seconds
            setTimeout(() => setSyncState('idle'), 3000)
        }

        const handlePendingChange = (event: CustomEvent) => {
            setPendingChanges(prev => prev + (event.detail?.count || 1))
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
        window.addEventListener('sync-start', handleSyncStart as EventListener)
        window.addEventListener('sync-success', handleSyncSuccess as EventListener)
        window.addEventListener('sync-error', handleSyncError as EventListener)
        window.addEventListener('pending-change', handlePendingChange as EventListener)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
            window.removeEventListener('sync-start', handleSyncStart as EventListener)
            window.removeEventListener('sync-success', handleSyncSuccess as EventListener)
            window.removeEventListener('sync-error', handleSyncError as EventListener)
            window.removeEventListener('pending-change', handlePendingChange as EventListener)
        }
    }, [pendingChanges])

    const startSync = async () => {
        if (syncState === 'syncing' || !navigator.onLine) return

        window.dispatchEvent(new CustomEvent('sync-start'))

        try {
            // Simulate sync process - in real app, this would sync pending data
            await new Promise(resolve => setTimeout(resolve, 1000))

            // For demo purposes, randomly succeed or fail
            if (Math.random() > 0.2) {
                window.dispatchEvent(new CustomEvent('sync-success'))
            } else {
                throw new Error('Sync failed')
            }
        } catch (error) {
            console.error('Sync error:', error)
            window.dispatchEvent(new CustomEvent('sync-error'))
        }
    }

    const formatLastSync = (date: Date) => {
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / (1000 * 60))

        if (diffMins < 1) return 'Baru saja'
        if (diffMins < 60) return `${diffMins} menit lalu`

        const diffHours = Math.floor(diffMins / 60)
        if (diffHours < 24) return `${diffHours} jam lalu`

        return date.toLocaleDateString('id-ID')
    }

    // Don't show if idle and no pending changes
    if (syncState === 'idle' && pendingChanges === 0) {
        return null
    }

    return (
        <div className={`flex items-center gap-2 text-sm ${className}`}>
            {syncState === 'syncing' && (
                <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-blue-600">Menyinkronkan...</span>
                </>
            )}

            {syncState === 'success' && (
                <>
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Tersinkronisasi</span>
                </>
            )}

            {syncState === 'error' && (
                <>
                    <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">Gagal sinkronisasi</span>
                    <button
                        onClick={startSync}
                        className="text-blue-600 hover:text-blue-700 underline ml-1"
                    >
                        Coba lagi
                    </button>
                </>
            )}

            {syncState === 'idle' && pendingChanges > 0 && (
                <>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-orange-600">
                        {pendingChanges} perubahan belum tersinkronisasi
                    </span>
                    {navigator.onLine && (
                        <button
                            onClick={startSync}
                            className="text-blue-600 hover:text-blue-700 underline ml-1"
                        >
                            Sinkronkan
                        </button>
                    )}
                </>
            )}

            {lastSyncTime && syncState === 'idle' && pendingChanges === 0 && (
                <span className="text-neutral-500">
                    Terakhir disinkronkan {formatLastSync(lastSyncTime)}
                </span>
            )}
        </div>
    )
}

// Utility functions to trigger sync events
export const syncUtils = {
    addPendingChange: (count = 1) => {
        window.dispatchEvent(new CustomEvent('pending-change', { detail: { count } }))
    },

    startSync: () => {
        window.dispatchEvent(new CustomEvent('sync-start'))
    },

    syncSuccess: () => {
        window.dispatchEvent(new CustomEvent('sync-success'))
    },

    syncError: () => {
        window.dispatchEvent(new CustomEvent('sync-error'))
    }
}