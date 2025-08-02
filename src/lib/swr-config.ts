import type { SWRConfiguration } from 'swr'

// Default fetcher function
const fetcher = async (url: string) => {
    const res = await fetch(url, {
        credentials: 'include', // Include cookies for authentication
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.') as Error & {
            info?: unknown
            status?: number
        }

        // Try to get error info, but handle cases where response is not JSON
        try {
            error.info = await res.json()
        } catch {
            error.info = { message: `HTTP ${res.status}: ${res.statusText}` }
        }

        error.status = res.status

        // Log authentication errors for debugging
        if (res.status === 401) {
            console.error('Authentication error:', {
                url,
                status: res.status,
                statusText: res.statusText,
                info: error.info
            })
        }

        throw error
    }

    return res.json()
}

// Enhanced fetcher with offline support and performance monitoring
const offlineAwareFetcher = async (url: string) => {
    // Import performance monitor dynamically to avoid circular dependencies
    const { PerformanceMonitor } = await import('./performance-monitor')

    PerformanceMonitor.startTiming(`swr-fetch-${url}`)

    try {
        const res = await fetch(url, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!res.ok) {
            const error = new Error('An error occurred while fetching the data.') as Error & {
                info?: unknown
                status?: number
            }

            try {
                error.info = await res.json()
            } catch {
                error.info = { message: `HTTP ${res.status}: ${res.statusText}` }
            }

            error.status = res.status

            if (res.status === 401) {
                console.error('Authentication error:', {
                    url,
                    status: res.status,
                    statusText: res.statusText,
                    info: error.info
                })
            }

            PerformanceMonitor.endTiming(`swr-fetch-${url}`)
            throw error
        }

        const data = await res.json()
        PerformanceMonitor.endTiming(`swr-fetch-${url}`)
        return data
    } catch (error) {
        PerformanceMonitor.endTiming(`swr-fetch-${url}`)

        // Check if we're offline
        if (!navigator.onLine) {
            const offlineError = new Error('You are offline. Showing cached data.') as Error & {
                isOffline?: boolean
                status?: number
            }
            offlineError.isOffline = true
            offlineError.status = 0
            throw offlineError
        }
        throw error
    }
}

// Persistent cache using localStorage for offline support
const createPersistentCache = () => {
    const cache = new Map()
    const CACHE_KEY = 'bayicare-swr-cache'
    const CACHE_EXPIRY_KEY = 'bayicare-swr-cache-expiry'

    // Load cache from localStorage on initialization
    if (typeof window !== 'undefined') {
        try {
            const stored = localStorage.getItem(CACHE_KEY)
            const expiry = localStorage.getItem(CACHE_EXPIRY_KEY)

            if (stored && expiry) {
                const expiryTime = JSON.parse(expiry)
                const now = Date.now()

                // Only load cache if not expired (24 hours)
                if (now - expiryTime < 24 * 60 * 60 * 1000) {
                    const data = JSON.parse(stored)
                    Object.entries(data).forEach(([key, value]) => {
                        cache.set(key, value)
                    })
                }
            }
        } catch (error) {
            console.warn('Failed to load SWR cache from localStorage:', error)
        }
    }

    // Save cache to localStorage periodically
    const saveCache = () => {
        if (typeof window !== 'undefined') {
            try {
                const data: Record<string, unknown> = {}
                cache.forEach((value, key) => {
                    data[key] = value
                })
                localStorage.setItem(CACHE_KEY, JSON.stringify(data))
                localStorage.setItem(CACHE_EXPIRY_KEY, JSON.stringify(Date.now()))
            } catch (error) {
                console.warn('Failed to save SWR cache to localStorage:', error)
            }
        }
    }

    // Override set method to trigger save
    const originalSet = cache.set.bind(cache)
    cache.set = (key: string, value: unknown) => {
        const result = originalSet(key, value)
        // Debounce saves to avoid too frequent localStorage writes
        clearTimeout((cache as unknown as { _saveTimeout?: NodeJS.Timeout })._saveTimeout)
            ; (cache as unknown as { _saveTimeout?: NodeJS.Timeout })._saveTimeout = setTimeout(saveCache, 1000)
        return result
    }

    return cache
}

// SWR configuration optimized for BayiCare app with offline support
export const swrConfig: SWRConfiguration = {
    fetcher: offlineAwareFetcher,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 0,
    dedupingInterval: 5000,
    errorRetryCount: 3,
    errorRetryInterval: 1000,
    loadingTimeout: 10000,
    focusThrottleInterval: 5000,

    // Persistent cache for offline support
    provider: createPersistentCache,

    // Enhanced error handling with offline awareness
    onError: (error: unknown, key) => {
        console.error('SWR Error:', error, 'Key:', key)

        // Don't show error notifications for offline scenarios
        if (error && typeof error === 'object' && 'isOffline' in error && error.isOffline) {
            console.info('Offline mode: Using cached data for', key)
            return
        }

        // Handle other errors
        if (typeof window !== 'undefined') {
            // You can integrate with notification store here
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            console.warn('Network error for key:', key, errorMessage)
        }
    },

    // Success handling with cache persistence
    onSuccess: (data: unknown, key) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('SWR Success:', key, data)
        }
    },

    // Handle reconnection
    onErrorRetry: (error: unknown, key, config, revalidate, { retryCount }) => {
        // Don't retry if offline
        if (error && typeof error === 'object' && 'isOffline' in error && error.isOffline) return

        // Don't retry on 404
        if (error && typeof error === 'object' && 'status' in error && error.status === 404) return

        // Don't retry on authentication errors
        if (error && typeof error === 'object' && 'status' in error && error.status === 401) return

        // Retry up to 3 times with exponential backoff
        if (retryCount >= 3) return

        setTimeout(() => revalidate({ retryCount }),
            2 ** retryCount * 1000)
    }
}

// Utility function to create API URLs
export const createApiUrl = (endpoint: string) => {
    // In production, use relative URLs to avoid CORS issues
    // In development, you can set NEXT_PUBLIC_API_URL if needed
    if (typeof window !== 'undefined') {
        // Client-side: use relative URLs
        return `/api${endpoint}`
    }

    // Server-side: use the full URL if available, otherwise relative
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXTAUTH_URL || ''
    return baseUrl ? `${baseUrl}/api${endpoint}` : `/api${endpoint}`
}

// Common SWR hooks for the app
export const swrKeys = {
    children: (userId: string) => createApiUrl(`/children?userId=${userId}`),
    child: (childId: string) => createApiUrl(`/children/${childId}`),
    growthRecords: (childId: string) => createApiUrl(`/growth/${childId}`),
    immunizationRecords: (childId: string) => createApiUrl(`/immunization/${childId}/records`),
    immunizationCalendar: (childId: string) => createApiUrl(`/immunization/${childId}/calendar`),
    immunizationStats: (childId: string) => createApiUrl(`/immunization/${childId}/stats`),
    immunizationUpcoming: (childId: string) => createApiUrl(`/immunization/${childId}/upcoming`),
    immunizationOverdue: (childId: string) => createApiUrl(`/immunization/${childId}/overdue`),
    mpasiFavorites: (childId: string) => createApiUrl(`/mpasi/favorites/${childId}`),
    mpasiRecipes: (ageMin?: number, ageMax?: number) => {
        const params = new URLSearchParams()
        if (ageMin) params.append('ageMin', ageMin.toString())
        if (ageMax) params.append('ageMax', ageMax.toString())
        return createApiUrl(`/mpasi/recipes?${params.toString()}`)
    }
}

// Export as apiUrls for backward compatibility
export const apiUrls = swrKeys