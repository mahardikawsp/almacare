import useSWR, { SWRConfiguration } from 'swr'
import { MemoryOptimizer, PerformanceMonitor } from '../lib/performance-monitor'

// Optimized fetcher with performance monitoring
const optimizedFetcher = MemoryOptimizer.memoize(async (url: string) => {
    PerformanceMonitor.startTiming(`api-${url}`)

    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        PerformanceMonitor.endTiming(`api-${url}`)
        return data
    } catch (error) {
        PerformanceMonitor.endTiming(`api-${url}`)
        throw error
    }
})

// Default SWR configuration optimized for performance
const defaultConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 0,
    dedupingInterval: 5000,
    errorRetryCount: 3,
    errorRetryInterval: 1000,
    loadingTimeout: 10000,
    focusThrottleInterval: 5000
}

// Optimized hook for API queries
export function useOptimizedQuery<T>(
    key: string | null,
    config?: SWRConfiguration
) {
    return useSWR<T>(
        key,
        optimizedFetcher,
        {
            ...defaultConfig,
            ...config
        }
    )
}

// Hook for dashboard data with optimized caching
export function useDashboardData(userId: string | null) {
    return useOptimizedQuery(
        userId ? `/api/dashboard/${userId}` : null,
        {
            refreshInterval: 30000, // Refresh every 30 seconds
            revalidateOnFocus: true
        }
    )
}

// Hook for growth records with pagination
export function useGrowthRecords(childId: string | null, limit = 50) {
    return useOptimizedQuery(
        childId ? `/api/growth/${childId}?limit=${limit}` : null,
        {
            revalidateOnFocus: false,
            dedupingInterval: 10000
        }
    )
}

// Hook for MPASI recipes with search optimization
export function useMPASIRecipes(ageInMonths: number, texture?: string) {
    const searchParams = new URLSearchParams({
        age: ageInMonths.toString(),
        ...(texture && { texture })
    })

    return useOptimizedQuery(
        `/api/mpasi/recipes?${searchParams.toString()}`,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000 // Cache for 1 minute
        }
    )
}

// Hook for immunization records
export function useImmunizationRecords(childId: string | null) {
    return useOptimizedQuery(
        childId ? `/api/immunization/${childId}` : null,
        {
            revalidateOnFocus: false,
            refreshInterval: 60000 // Refresh every minute
        }
    )
}