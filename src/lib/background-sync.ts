// Background sync utility for offline data synchronization

export interface PendingAction {
    id: string
    type: 'create' | 'update' | 'delete'
    endpoint: string
    data?: unknown
    timestamp: number
    retryCount: number
}

class BackgroundSyncManager {
    private static instance: BackgroundSyncManager
    private pendingActions: PendingAction[] = []
    private isOnline = true
    private syncInProgress = false
    private readonly STORAGE_KEY = 'bayicare-pending-actions'
    private readonly MAX_RETRIES = 3

    private constructor() {
        this.loadPendingActions()
        this.setupEventListeners()
    }

    static getInstance(): BackgroundSyncManager {
        if (!BackgroundSyncManager.instance) {
            BackgroundSyncManager.instance = new BackgroundSyncManager()
        }
        return BackgroundSyncManager.instance
    }

    private setupEventListeners() {
        if (typeof window === 'undefined') return

        // Monitor online/offline status
        window.addEventListener('online', () => {
            this.isOnline = true
            this.processPendingActions()
        })

        window.addEventListener('offline', () => {
            this.isOnline = false
        })

        // Set initial online status
        this.isOnline = navigator.onLine
    }

    private loadPendingActions() {
        if (typeof window === 'undefined') return

        try {
            const stored = localStorage.getItem(this.STORAGE_KEY)
            if (stored) {
                this.pendingActions = JSON.parse(stored)
            }
        } catch (error) {
            console.error('Failed to load pending actions:', error)
            this.pendingActions = []
        }
    }

    private savePendingActions() {
        if (typeof window === 'undefined') return

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.pendingActions))
        } catch (error) {
            console.error('Failed to save pending actions:', error)
        }
    }

    // Add an action to be synced when online
    addPendingAction(action: Omit<PendingAction, 'id' | 'timestamp' | 'retryCount'>) {
        const pendingAction: PendingAction = {
            ...action,
            id: this.generateId(),
            timestamp: Date.now(),
            retryCount: 0
        }

        this.pendingActions.push(pendingAction)
        this.savePendingActions()

        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('pending-change', {
            detail: { count: this.pendingActions.length }
        }))

        // Try to sync immediately if online
        if (this.isOnline) {
            this.processPendingActions()
        }

        return pendingAction.id
    }

    // Process all pending actions
    async processPendingActions() {
        if (!this.isOnline || this.syncInProgress || this.pendingActions.length === 0) {
            return
        }

        this.syncInProgress = true
        window.dispatchEvent(new CustomEvent('sync-start'))

        const actionsToProcess = [...this.pendingActions]
        const failedActions: PendingAction[] = []

        for (const action of actionsToProcess) {
            try {
                await this.executeAction(action)
                // Remove successful action
                this.pendingActions = this.pendingActions.filter(a => a.id !== action.id)
            } catch (error) {
                console.error('Failed to sync action:', action, error)

                // Increment retry count
                action.retryCount++

                // If max retries reached, remove the action
                if (action.retryCount >= this.MAX_RETRIES) {
                    console.error('Max retries reached for action:', action)
                    this.pendingActions = this.pendingActions.filter(a => a.id !== action.id)
                } else {
                    failedActions.push(action)
                }
            }
        }

        this.savePendingActions()
        this.syncInProgress = false

        // Dispatch appropriate events
        if (failedActions.length === 0) {
            window.dispatchEvent(new CustomEvent('sync-success'))
        } else {
            window.dispatchEvent(new CustomEvent('sync-error'))
        }

        // Update pending count
        window.dispatchEvent(new CustomEvent('pending-change', {
            detail: { count: this.pendingActions.length }
        }))
    }

    private async executeAction(action: PendingAction): Promise<void> {
        const { type, endpoint, data } = action

        let method: string
        let body: string | undefined

        switch (type) {
            case 'create':
                method = 'POST'
                body = JSON.stringify(data)
                break
            case 'update':
                method = 'PUT'
                body = JSON.stringify(data)
                break
            case 'delete':
                method = 'DELETE'
                break
            default:
                throw new Error(`Unknown action type: ${type}`)
        }

        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return response.json()
    }

    // Get pending actions count
    getPendingCount(): number {
        return this.pendingActions.length
    }

    // Clear all pending actions (use with caution)
    clearPendingActions() {
        this.pendingActions = []
        this.savePendingActions()
        window.dispatchEvent(new CustomEvent('pending-change', { detail: { count: 0 } }))
    }

    // Remove a specific pending action
    removePendingAction(id: string) {
        this.pendingActions = this.pendingActions.filter(action => action.id !== id)
        this.savePendingActions()
        window.dispatchEvent(new CustomEvent('pending-change', {
            detail: { count: this.pendingActions.length }
        }))
    }

    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
}

// Export singleton instance
export const backgroundSync = BackgroundSyncManager.getInstance()

// Utility functions for common operations
export const syncUtils = {
    // Add a create operation to sync queue
    addCreateAction: (endpoint: string, data: unknown) => {
        return backgroundSync.addPendingAction({
            type: 'create',
            endpoint,
            data
        })
    },

    // Add an update operation to sync queue
    addUpdateAction: (endpoint: string, data: unknown) => {
        return backgroundSync.addPendingAction({
            type: 'update',
            endpoint,
            data
        })
    },

    // Add a delete operation to sync queue
    addDeleteAction: (endpoint: string) => {
        return backgroundSync.addPendingAction({
            type: 'delete',
            endpoint
        })
    },

    // Force sync all pending actions
    forcSync: () => {
        return backgroundSync.processPendingActions()
    },

    // Get pending actions count
    getPendingCount: () => {
        return backgroundSync.getPendingCount()
    }
}

// Enhanced fetch wrapper that automatically queues actions when offline
export const offlineAwareFetch = async (
    url: string,
    options: RequestInit = {}
): Promise<Response> => {
    // If online, try normal fetch
    if (navigator.onLine) {
        try {
            const response = await fetch(url, options)
            return response
        } catch (error) {
            // If fetch fails but we think we're online, we might have lost connection
            if (!navigator.onLine) {
                throw new Error('Connection lost during request')
            }
            throw error
        }
    }

    // If offline and it's a mutation, queue it
    const method = options.method?.toUpperCase() || 'GET'

    if (['POST', 'PUT', 'DELETE'].includes(method)) {
        let actionType: 'create' | 'update' | 'delete'

        switch (method) {
            case 'POST':
                actionType = 'create'
                break
            case 'PUT':
                actionType = 'update'
                break
            case 'DELETE':
                actionType = 'delete'
                break
            default:
                throw new Error('Unsupported method for offline queue')
        }

        const data = options.body ? JSON.parse(options.body as string) : undefined

        backgroundSync.addPendingAction({
            type: actionType,
            endpoint: url,
            data
        })

        // Return a mock successful response
        return new Response(JSON.stringify({ queued: true }), {
            status: 202,
            statusText: 'Accepted (Queued for sync)',
            headers: { 'Content-Type': 'application/json' }
        })
    }

    // For GET requests when offline, throw an error
    throw new Error('No internet connection and request cannot be queued')
}