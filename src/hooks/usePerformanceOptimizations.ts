"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PERFORMANCE_CONFIG } from '@/lib/performance-config'

// Main performance optimization hook
export function usePerformanceOptimizations() {
    const [isOptimized, setIsOptimized] = useState(false)
    const performanceObserver = useRef<PerformanceObserver | null>(null)

    useEffect(() => {
        // Initialize performance monitoring
        if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
            performanceObserver.current = new PerformanceObserver((list) => {
                const entries = list.getEntries()
                entries.forEach((entry) => {
                    if (entry.entryType === 'measure' && entry.duration > PERFORMANCE_CONFIG.monitoring.renderTimeThreshold) {
                        console.warn(`Performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`)
                    }
                })
            })

            performanceObserver.current.observe({ entryTypes: ['measure', 'navigation'] })
        }

        setIsOptimized(true)

        return () => {
            performanceObserver.current?.disconnect()
        }
    }, [])

    return { isOptimized }
}

// Hook for optimizing large lists
export function useListOptimization<T>(
    items: T[],
    options: {
        virtualizeThreshold?: number
        pageSize?: number
        searchable?: boolean
    } = {}
) {
    const {
        virtualizeThreshold = PERFORMANCE_CONFIG.components.table.virtualizeAfter,
        pageSize = PERFORMANCE_CONFIG.components.table.pageSize,
        searchable = false
    } = options

    const [currentPage, setCurrentPage] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredItems = useMemo(() => {
        if (!searchable || !searchTerm) return items

        return items.filter((item) => {
            const searchableText = Object.values(item as Record<string, unknown>).join(' ').toLowerCase()
            return searchableText.includes(searchTerm.toLowerCase())
        })
    }, [items, searchTerm, searchable])

    const shouldVirtualize = filteredItems.length > virtualizeThreshold
    const shouldPaginate = !shouldVirtualize && filteredItems.length > pageSize

    const paginatedItems = useMemo(() => {
        if (shouldVirtualize || !shouldPaginate) return filteredItems

        const start = currentPage * pageSize
        const end = start + pageSize
        return filteredItems.slice(start, end)
    }, [filteredItems, currentPage, pageSize, shouldVirtualize, shouldPaginate])

    const totalPages = Math.ceil(filteredItems.length / pageSize)

    return {
        items: shouldVirtualize ? filteredItems : paginatedItems,
        shouldVirtualize,
        shouldPaginate,
        currentPage,
        totalPages,
        searchTerm,
        setCurrentPage,
        setSearchTerm,
        totalItems: filteredItems.length
    }
}

// Hook for optimizing component renders
export function useRenderOptimization(componentName: string) {
    const renderCount = useRef(0)
    const lastRenderTime = useRef(0)

    useEffect(() => {
        renderCount.current += 1
        const now = performance.now()

        if (lastRenderTime.current > 0) {
            const timeSinceLastRender = now - lastRenderTime.current
            if (timeSinceLastRender < 16) { // Less than one frame
                console.warn(`${componentName} is re-rendering too frequently (${timeSinceLastRender.toFixed(2)}ms since last render)`)
            }
        }

        lastRenderTime.current = now
    })

    const measureRender = useCallback((fn: () => void) => {
        performance.mark(`${componentName}-render-start`)
        fn()
        performance.mark(`${componentName}-render-end`)
        performance.measure(`${componentName}-render`, `${componentName}-render-start`, `${componentName}-render-end`)
    }, [componentName])

    return {
        renderCount: renderCount.current,
        measureRender
    }
}

// Hook for optimizing image loading
export function useImageOptimization() {
    const [loadedImages, setLoadedImages] = useState(new Set<string>())
    const imageCache = useRef(new Map<string, HTMLImageElement>())

    const preloadImage = useCallback((src: string) => {
        if (loadedImages.has(src) || imageCache.current.has(src)) {
            return Promise.resolve()
        }

        return new Promise<void>((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
                imageCache.current.set(src, img)
                setLoadedImages(prev => new Set(prev).add(src))
                resolve()
            }
            img.onerror = reject
            img.src = src
        })
    }, [loadedImages])

    const preloadImages = useCallback((sources: string[]) => {
        return Promise.allSettled(sources.map(preloadImage))
    }, [preloadImage])

    const isImageLoaded = useCallback((src: string) => {
        return loadedImages.has(src)
    }, [loadedImages])

    return {
        preloadImage,
        preloadImages,
        isImageLoaded,
        loadedImagesCount: loadedImages.size
    }
}

// Hook for optimizing API calls
export function useAPIOptimization() {
    const requestCache = useRef(new Map<string, { data: unknown; timestamp: number }>())
    const pendingRequests = useRef(new Map<string, Promise<unknown>>())

    const cachedFetch = useCallback(async (
        url: string,
        options: RequestInit = {},
        cacheTime = 5 * 60 * 1000 // 5 minutes
    ) => {
        const cacheKey = `${url}-${JSON.stringify(options)}`

        // Check cache
        const cached = requestCache.current.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < cacheTime) {
            return cached.data
        }

        // Check pending requests
        const pending = pendingRequests.current.get(cacheKey)
        if (pending) {
            return pending
        }

        // Make new request
        const request = fetch(url, options)
            .then(response => response.json())
            .then(data => {
                requestCache.current.set(cacheKey, { data, timestamp: Date.now() })
                pendingRequests.current.delete(cacheKey)
                return data
            })
            .catch(error => {
                pendingRequests.current.delete(cacheKey)
                throw error
            })

        pendingRequests.current.set(cacheKey, request)
        return request
    }, [])

    const clearCache = useCallback((pattern?: string) => {
        if (pattern) {
            for (const key of requestCache.current.keys()) {
                if (key.includes(pattern)) {
                    requestCache.current.delete(key)
                }
            }
        } else {
            requestCache.current.clear()
        }
    }, [])

    return {
        cachedFetch,
        clearCache,
        cacheSize: requestCache.current.size
    }
}

// Hook for optimizing animations
export function useAnimationOptimization() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
    const animationFrameRef = useRef<number>()

    useEffect(() => {
        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setPrefersReducedMotion(mediaQuery.matches)

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches)
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    const requestAnimationFrame = useCallback((callback: () => void) => {
        if (prefersReducedMotion) {
            callback()
            return
        }

        animationFrameRef.current = window.requestAnimationFrame(callback)
    }, [prefersReducedMotion])

    const cancelAnimationFrame = useCallback(() => {
        if (animationFrameRef.current) {
            window.cancelAnimationFrame(animationFrameRef.current)
        }
    }, [])

    return {
        prefersReducedMotion,
        requestAnimationFrame,
        cancelAnimationFrame
    }
}

// Hook for bundle size optimization
export function useBundleOptimization() {
    const [bundleInfo, setBundleInfo] = useState<{
        totalChunks: number
        loadedChunks: number
        estimatedSize: number
    }>({
        totalChunks: 0,
        loadedChunks: 0,
        estimatedSize: 0
    })

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const scripts = document.querySelectorAll('script[src*="_next"]')
            const totalChunks = scripts.length

            let loadedChunks = 0
            let estimatedSize = 0

            scripts.forEach(script => {
                if (script.getAttribute('data-loaded')) {
                    loadedChunks++
                }
                // Rough size estimation based on script src
                estimatedSize += 50 // KB estimate per chunk
            })

            setBundleInfo({
                totalChunks,
                loadedChunks,
                estimatedSize
            })
        }
    }, [])

    return bundleInfo
}