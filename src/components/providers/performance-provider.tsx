"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { PERFORMANCE_CONFIG, type PerformanceConfig } from '@/lib/performance-config'

interface PerformanceContextType {
    config: PerformanceConfig
    isOptimized: boolean
    metrics: {
        fps: number
        loadTime: number
        memoryUsage: number
        bundleSize: number
    }
    updateConfig: (updates: Partial<PerformanceConfig>) => void
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined)

export function usePerformanceContext() {
    const context = useContext(PerformanceContext)
    if (!context) {
        throw new Error('usePerformanceContext must be used within a PerformanceProvider')
    }
    return context
}

interface PerformanceProviderProps {
    children: React.ReactNode
    initialConfig?: Partial<PerformanceConfig>
}

export function PerformanceProvider({
    children,
    initialConfig = {}
}: PerformanceProviderProps) {
    const [config, setConfig] = useState<PerformanceConfig>({
        ...PERFORMANCE_CONFIG,
        ...initialConfig
    })

    const [isOptimized, setIsOptimized] = useState(false)
    const [metrics, setMetrics] = useState({
        fps: 0,
        loadTime: 0,
        memoryUsage: 0,
        bundleSize: 0
    })

    useEffect(() => {
        // Initialize performance monitoring
        let frameCount = 0
        let lastTime = performance.now()

        const measureFPS = () => {
            frameCount++
            const currentTime = performance.now()

            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
                setMetrics(prev => ({ ...prev, fps }))
                frameCount = 0
                lastTime = currentTime
            }

            requestAnimationFrame(measureFPS)
        }

        requestAnimationFrame(measureFPS)

        // Measure initial load time
        if (typeof window !== 'undefined') {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
            setMetrics(prev => ({ ...prev, loadTime }))
        }

        // Monitor memory usage
        const monitorMemory = () => {
            if ('memory' in performance) {
                const memory = (performance as { memory?: { usedJSHeapSize: number } }).memory
                const memoryUsage = memory?.usedJSHeapSize || 0
                setMetrics(prev => ({ ...prev, memoryUsage }))
            }
        }

        const memoryInterval = setInterval(monitorMemory, 5000)

        // Monitor bundle size
        const scripts = document.querySelectorAll('script[src*="_next"]')
        setMetrics(prev => ({ ...prev, bundleSize: scripts.length }))

        setIsOptimized(true)

        return () => {
            clearInterval(memoryInterval)
        }
    }, [])

    const updateConfig = (updates: Partial<PerformanceConfig>) => {
        setConfig(prev => ({ ...prev, ...updates }))
    }

    const value: PerformanceContextType = {
        config,
        isOptimized,
        metrics,
        updateConfig
    }

    return (
        <PerformanceContext.Provider value={value}>
            {children}
        </PerformanceContext.Provider>
    )
}

// HOC for performance optimization
export function withPerformanceOptimization<P extends object>(
    Component: React.ComponentType<P>,
    options: {
        lazy?: boolean
        virtualizeThreshold?: number
        measureRender?: boolean
    } = {}
) {
    const { lazy = false, measureRender = false } = options

    const OptimizedComponent = (props: P) => {
        usePerformanceContext() // Keep the hook call but don't use config

        useEffect(() => {
            if (measureRender) {
                const componentName = Component.displayName || Component.name || 'Component'
                performance.mark(`${componentName}-render-start`)

                return () => {
                    performance.mark(`${componentName}-render-end`)
                    performance.measure(
                        `${componentName}-render`,
                        `${componentName}-render-start`,
                        `${componentName}-render-end`
                    )
                }
            }
        })

        return <Component {...props} />
    }

    OptimizedComponent.displayName = `withPerformanceOptimization(${Component.displayName || Component.name})`

    if (lazy) {
        return React.lazy(() => Promise.resolve({ default: OptimizedComponent }))
    }

    return OptimizedComponent
}

// Performance boundary component
export function PerformanceBoundary({
    children,
    fallback,
    threshold = 100
}: {
    children: React.ReactNode
    fallback?: React.ReactNode
    threshold?: number
}) {
    const [hasPerformanceIssue, setHasPerformanceIssue] = useState(false)
    const { metrics } = usePerformanceContext()

    useEffect(() => {
        if (metrics.fps > 0 && metrics.fps < threshold) {
            setHasPerformanceIssue(true)
        } else if (metrics.fps >= threshold) {
            setHasPerformanceIssue(false)
        }
    }, [metrics.fps, threshold])

    if (hasPerformanceIssue && fallback) {
        return <>{fallback}</>
    }

    return <>{children}</>
}