"use client"

import { useCallback, useRef, useEffect, useState } from 'react'

// Hook for performance optimization
export function usePerformanceOptimization() {
    const [isVisible, setIsVisible] = useState(false)
    const [shouldRender, setShouldRender] = useState(false)
    const elementRef = useRef<HTMLElement>(null)

    // Intersection Observer for lazy rendering
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting)
                if (entry.isIntersecting) {
                    setShouldRender(true)
                }
            },
            {
                rootMargin: '50px', // Start loading 50px before element is visible
                threshold: 0.1
            }
        )

        if (elementRef.current) {
            observer.observe(elementRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return {
        elementRef,
        isVisible,
        shouldRender
    }
}

// Debounced callback hook for performance
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
    callback: T,
    delay: number
): T {
    const timeoutRef = useRef<NodeJS.Timeout>()

    return useCallback(
        ((...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args)
            }, delay)
        }) as T,
        [callback, delay]
    )
}

// Throttled callback hook for performance
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
    callback: T,
    delay: number
): T {
    const lastCallRef = useRef<number>(0)

    return useCallback(
        ((...args: Parameters<T>) => {
            const now = Date.now()
            if (now - lastCallRef.current >= delay) {
                lastCallRef.current = now
                callback(...args)
            }
        }) as T,
        [callback, delay]
    )
}

// Memoized component wrapper for expensive renders
export function withMemoization<P extends object>(
    Component: React.ComponentType<P>,
    areEqual?: (prevProps: P, nextProps: P) => boolean
) {
    return React.memo(Component, areEqual)
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
    const renderCountRef = useRef(0)
    const startTimeRef = useRef<number>()

    useEffect(() => {
        renderCountRef.current += 1
        startTimeRef.current = performance.now()

        return () => {
            if (startTimeRef.current) {
                const renderTime = performance.now() - startTimeRef.current
                if (renderTime > 16) { // More than one frame (16ms)
                    console.warn(
                        `${componentName} render took ${renderTime.toFixed(2)}ms (render #${renderCountRef.current})`
                    )
                }
            }
        }
    })

    return {
        renderCount: renderCountRef.current
    }
}

// Bundle size analyzer utility
export function analyzeBundleSize() {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        const scripts = Array.from(document.querySelectorAll('script[src]'))
        const totalSize = scripts.reduce((acc, script) => {
            const src = script.getAttribute('src')
            if (src && src.includes('/_next/static/')) {
                // Estimate size based on script src (this is approximate)
                return acc + 1
            }
            return acc
        }, 0)

        console.log(`Estimated bundle count: ${totalSize} chunks`)
    }
}

// Memory usage monitor
export function useMemoryMonitor() {
    const [memoryInfo, setMemoryInfo] = useState<{
        usedJSHeapSize?: number
        totalJSHeapSize?: number
        jsHeapSizeLimit?: number
    }>({})

    useEffect(() => {
        const updateMemoryInfo = () => {
            if ('memory' in performance) {
                const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory
                setMemoryInfo({
                    usedJSHeapSize: memory.usedJSHeapSize,
                    totalJSHeapSize: memory.totalJSHeapSize,
                    jsHeapSizeLimit: memory.jsHeapSizeLimit
                })
            }
        }

        updateMemoryInfo()
        const interval = setInterval(updateMemoryInfo, 5000) // Update every 5 seconds

        return () => clearInterval(interval)
    }, [])

    return memoryInfo
}

// Lazy image loading hook
export function useLazyImage(src: string, placeholder?: string) {
    const [imageSrc, setImageSrc] = useState(placeholder || '')
    const [isLoaded, setIsLoaded] = useState(false)
    const [isError, setIsError] = useState(false)
    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const img = new Image()
                    img.onload = () => {
                        setImageSrc(src)
                        setIsLoaded(true)
                    }
                    img.onerror = () => {
                        setIsError(true)
                    }
                    img.src = src
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )

        if (imgRef.current) {
            observer.observe(imgRef.current)
        }

        return () => observer.disconnect()
    }, [src])

    return {
        imgRef,
        imageSrc,
        isLoaded,
        isError
    }
}

// Component preloader for critical components
export function preloadComponent(componentImport: () => Promise<unknown>) {
    // Preload on idle or after a delay
    if (typeof window !== 'undefined') {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                componentImport()
            })
        } else {
            setTimeout(() => {
                componentImport()
            }, 100)
        }
    }
}

// Resource hints for better loading performance
export function addResourceHints() {
    if (typeof document !== 'undefined') {
        // Add preconnect for external resources
        const preconnectLinks = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ]

        preconnectLinks.forEach(href => {
            const link = document.createElement('link')
            link.rel = 'preconnect'
            link.href = href
            link.crossOrigin = 'anonymous'
            document.head.appendChild(link)
        })
    }
}

// Critical CSS inlining utility
export function inlineCriticalCSS(css: string) {
    if (typeof document !== 'undefined') {
        const style = document.createElement('style')
        style.textContent = css
        document.head.appendChild(style)
    }
}