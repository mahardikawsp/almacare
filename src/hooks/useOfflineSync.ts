'use client'

import { useEffect, useState } from 'react'
import { backgroundSync, syncUtils } from '@/lib/background-sync'
import { mutate } from 'swr'

export function useOfflineSync() {
    const [isOnline, setIsOnline] = useState(true)
    const [pendingCount, setPendingCount] = useState(0)
    const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')

    useEffect(() => {
        // Set initial state
        setIsOnline(navigator.onLine)
        setPendingCount(backgroundSync.getPendingCount())

        // Online/offline handlers
        const handleOnline = () => {
            setIsOnline(true)
        }

        const handleOffline = () => {
            setIsOnline(false)
        }

        // Sync status handlers
        const handleSyncStart = () => {
            setSyncStatus('syncing')
        }

        const handleSyncSuccess = () => {
            setSyncStatus('success')
            // Revalidate all SWR cache after successful sync
            mutate(() => true, undefined, { revalidate: true })
            setTimeout(() => setSyncStatus('idle'), 2000)
        }

        const handleSyncError = () => {
            setSyncStatus('error')
            setTimeout(() => setSyncStatus('idle'), 3000)
        }

        const handlePendingChange = (event: CustomEvent) => {
            setPendingCount(event.detail?.count || 0)
        }

        // Add event listeners
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
    }, [])

    const forceSync = () => {
        if (isOnline) {
            syncUtils.forcSync()
        }
    }

    return {
        isOnline,
        pendingCount,
        syncStatus,
        forceSync,
        addCreateAction: syncUtils.addCreateAction,
        addUpdateAction: syncUtils.addUpdateAction,
        addDeleteAction: syncUtils.addDeleteAction
    }
}

// Hook for offline-aware mutations
export function useOfflineMutation() {
    const { isOnline, addCreateAction, addUpdateAction, addDeleteAction } = useOfflineSync()

    const createMutation = async (endpoint: string, data: unknown) => {
        if (isOnline) {
            // Try immediate request
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(data)
                })

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`)
                }

                return response.json()
            } catch (error) {
                // If failed and now offline, queue it
                if (!navigator.onLine) {
                    addCreateAction(endpoint, data)
                    return { queued: true }
                }
                throw error
            }
        } else {
            // Queue for later
            addCreateAction(endpoint, data)
            return { queued: true }
        }
    }

    const updateMutation = async (endpoint: string, data: unknown) => {
        if (isOnline) {
            try {
                const response = await fetch(endpoint, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(data)
                })

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`)
                }

                return response.json()
            } catch (error) {
                if (!navigator.onLine) {
                    addUpdateAction(endpoint, data)
                    return { queued: true }
                }
                throw error
            }
        } else {
            addUpdateAction(endpoint, data)
            return { queued: true }
        }
    }

    const deleteMutation = async (endpoint: string) => {
        if (isOnline) {
            try {
                const response = await fetch(endpoint, {
                    method: 'DELETE',
                    credentials: 'include'
                })

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`)
                }

                return response.json()
            } catch (error) {
                if (!navigator.onLine) {
                    addDeleteAction(endpoint)
                    return { queued: true }
                }
                throw error
            }
        } else {
            addDeleteAction(endpoint)
            return { queued: true }
        }
    }

    return {
        createMutation,
        updateMutation,
        deleteMutation,
        isOnline
    }
}