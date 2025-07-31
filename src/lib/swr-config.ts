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

// SWR configuration optimized for BayiCare app
export const swrConfig: SWRConfiguration = {
    fetcher,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 0, // Disable automatic refresh
    dedupingInterval: 5000, // 5 seconds
    errorRetryCount: 3,
    errorRetryInterval: 1000,
    loadingTimeout: 10000, // 10 seconds
    focusThrottleInterval: 5000,

    // Cache configuration
    provider: () => new Map(),

    // Error handling
    onError: (error, key) => {
        console.error('SWR Error:', error, 'Key:', key)

        // You can add toast notification here
        // useNotificationStore.getState().addToastNotification({
        //   title: 'Error',
        //   message: 'Failed to load data. Please try again.',
        //   type: 'error',
        //   duration: 5000,
        //   autoHide: true
        // })
    },

    // Success handling
    onSuccess: (data, key) => {
        // Optional: Log successful requests in development
        if (process.env.NODE_ENV === 'development') {
            console.log('SWR Success:', key, data)
        }
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