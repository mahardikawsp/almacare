// Enhanced API client with offline support and background sync

import { backgroundSync } from './background-sync'

export interface ApiClientOptions extends RequestInit {
    skipOfflineQueue?: boolean // Skip offline queueing for this request
}

class ApiClient {
    private baseUrl: string

    constructor(baseUrl = '/api') {
        this.baseUrl = baseUrl
    }

    private async makeRequest(
        endpoint: string,
        options: ApiClientOptions = {}
    ): Promise<Response> {
        const { skipOfflineQueue, ...fetchOptions } = options
        const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`

        // Default headers
        const headers = {
            'Content-Type': 'application/json',
            ...fetchOptions.headers
        }

        const requestOptions: RequestInit = {
            credentials: 'include',
            ...fetchOptions,
            headers
        }

        // If online, try normal fetch
        if (navigator.onLine) {
            try {
                const response = await fetch(url, requestOptions)
                return response
            } catch (error) {
                // If fetch fails but we think we're online, we might have lost connection
                if (!navigator.onLine) {
                    throw new Error('Connection lost during request')
                }
                throw error
            }
        }

        // If offline and it's a mutation, queue it (unless explicitly skipped)
        const method = requestOptions.method?.toUpperCase() || 'GET'

        if (!skipOfflineQueue && ['POST', 'PUT', 'DELETE'].includes(method)) {
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

            const data = requestOptions.body ? JSON.parse(requestOptions.body as string) : undefined

            backgroundSync.addPendingAction({
                type: actionType,
                endpoint: url,
                data
            })

            // Return a mock successful response
            return new Response(JSON.stringify({
                queued: true,
                message: 'Request queued for sync when online'
            }), {
                status: 202,
                statusText: 'Accepted (Queued for sync)',
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // For GET requests when offline, throw an error
        throw new Error('No internet connection')
    }

    // GET request
    async get(endpoint: string, options: ApiClientOptions = {}) {
        return this.makeRequest(endpoint, { ...options, method: 'GET' })
    }

    // POST request
    async post(endpoint: string, data?: unknown, options: ApiClientOptions = {}) {
        return this.makeRequest(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined
        })
    }

    // PUT request
    async put(endpoint: string, data?: unknown, options: ApiClientOptions = {}) {
        return this.makeRequest(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined
        })
    }

    // DELETE request
    async delete(endpoint: string, options: ApiClientOptions = {}) {
        return this.makeRequest(endpoint, { ...options, method: 'DELETE' })
    }

    // PATCH request
    async patch(endpoint: string, data?: unknown, options: ApiClientOptions = {}) {
        return this.makeRequest(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined
        })
    }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Convenience functions that handle JSON parsing and error handling
export const api = {
    // GET with JSON response
    get: async <T = unknown>(endpoint: string, options?: ApiClientOptions): Promise<T> => {
        const response = await apiClient.get(endpoint, options)

        if (!response.ok) {
            const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as Error & {
                status?: number
                response?: Response
            }
            error.status = response.status
            error.response = response
            throw error
        }

        return response.json()
    },

    // POST with JSON response
    post: async <T = unknown>(endpoint: string, data?: unknown, options?: ApiClientOptions): Promise<T> => {
        const response = await apiClient.post(endpoint, data, options)

        if (!response.ok && response.status !== 202) { // 202 is for queued requests
            const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as Error & {
                status?: number
                response?: Response
            }
            error.status = response.status
            error.response = response
            throw error
        }

        return response.json()
    },

    // PUT with JSON response
    put: async <T = unknown>(endpoint: string, data?: unknown, options?: ApiClientOptions): Promise<T> => {
        const response = await apiClient.put(endpoint, data, options)

        if (!response.ok && response.status !== 202) {
            const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as Error & {
                status?: number
                response?: Response
            }
            error.status = response.status
            error.response = response
            throw error
        }

        return response.json()
    },

    // DELETE with JSON response
    delete: async <T = unknown>(endpoint: string, options?: ApiClientOptions): Promise<T> => {
        const response = await apiClient.delete(endpoint, options)

        if (!response.ok && response.status !== 202) {
            const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as Error & {
                status?: number
                response?: Response
            }
            error.status = response.status
            error.response = response
            throw error
        }

        return response.json()
    },

    // PATCH with JSON response
    patch: async <T = unknown>(endpoint: string, data?: unknown, options?: ApiClientOptions): Promise<T> => {
        const response = await apiClient.patch(endpoint, data, options)

        if (!response.ok && response.status !== 202) {
            const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as Error & {
                status?: number
                response?: Response
            }
            error.status = response.status
            error.response = response
            throw error
        }

        return response.json()
    }
}

// Utility to check if a response was queued for offline sync
export const isQueuedResponse = (data: unknown): boolean => {
    return !!(data &&
        typeof data === 'object' &&
        data !== null &&
        'queued' in data &&
        (data as { queued: boolean }).queued === true)
}

// Export the client for direct use if needed
export default apiClient