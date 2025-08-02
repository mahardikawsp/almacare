// Performance monitoring utilities
export class PerformanceMonitor {
    private static metrics: Map<string, number[]> = new Map()

    // Memory usage monitoring
    static getMemoryUsage() {
        if (typeof window !== 'undefined' && 'performance' in window && 'memory' in (window.performance as any)) {
            const memory = (window.performance as any).memory
            return {
                usedJSHeapSize: memory.usedJSHeapSize,
                totalJSHeapSize: memory.totalJSHeapSize,
                jsHeapSizeLimit: memory.jsHeapSizeLimit,
                usedPercentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
            }
        }
        return null
    }

    // Server-side memory monitoring (Node.js)
    static getServerMemoryUsage() {
        if (typeof process !== 'undefined' && process.memoryUsage) {
            const usage = process.memoryUsage()
            return {
                rss: usage.rss, // Resident Set Size
                heapTotal: usage.heapTotal,
                heapUsed: usage.heapUsed,
                external: usage.external,
                arrayBuffers: usage.arrayBuffers,
                heapUsedPercentage: Math.round((usage.heapUsed / usage.heapTotal) * 100)
            }
        }
        return null
    }

    // Performance timing
    static startTiming(label: string) {
        if (typeof performance !== 'undefined') {
            performance.mark(`${label}-start`)
        }
    }

    static endTiming(label: string) {
        if (typeof performance !== 'undefined') {
            performance.mark(`${label}-end`)
            performance.measure(label, `${label}-start`, `${label}-end`)

            const measure = performance.getEntriesByName(label)[0]
            if (measure) {
                PerformanceMonitor.recordMetric(label, measure.duration)
                return measure.duration
            }
        }
        return 0
    }

    // Record performance metrics
    private static recordMetric(label: string, value: number) {
        if (!PerformanceMonitor.metrics.has(label)) {
            PerformanceMonitor.metrics.set(label, [])
        }
        const values = PerformanceMonitor.metrics.get(label)!
        values.push(value)

        // Keep only last 100 measurements
        if (values.length > 100) {
            values.shift()
        }
    }

    // Get performance statistics
    static getMetricStats(label: string) {
        const values = PerformanceMonitor.metrics.get(label)
        if (!values || values.length === 0) return null

        const sorted = [...values].sort((a, b) => a - b)
        return {
            count: values.length,
            min: sorted[0],
            max: sorted[sorted.length - 1],
            avg: values.reduce((sum, val) => sum + val, 0) / values.length,
            median: sorted[Math.floor(sorted.length / 2)],
            p95: sorted[Math.floor(sorted.length * 0.95)]
        }
    }

    // Component render tracking
    static trackComponentRender(componentName: string) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`🔄 ${componentName} rendered at ${new Date().toISOString()}`)
        }
    }

    // Memory leak detection
    static detectMemoryLeaks() {
        const usage = PerformanceMonitor.getMemoryUsage()
        if (usage && usage.usedPercentage > 80) {
            console.warn('⚠️ High memory usage detected:', usage)
            return true
        }
        return false
    }

    // Bundle size tracking
    static trackBundleSize() {
        if (typeof window !== 'undefined' && 'performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
            if (navigation) {
                return {
                    transferSize: navigation.transferSize,
                    encodedBodySize: navigation.encodedBodySize,
                    decodedBodySize: navigation.decodedBodySize,
                    compressionRatio: navigation.encodedBodySize / navigation.decodedBodySize
                }
            }
        }
        return null
    }

    // Clear all metrics
    static clearMetrics() {
        PerformanceMonitor.metrics.clear()
        if (typeof performance !== 'undefined') {
            performance.clearMarks()
            performance.clearMeasures()
        }
    }

    // Get all performance data
    static getPerformanceReport() {
        const memoryUsage = PerformanceMonitor.getMemoryUsage()
        const bundleSize = PerformanceMonitor.trackBundleSize()
        const allMetrics: Record<string, any> = {}

        for (const [label] of PerformanceMonitor.metrics) {
            allMetrics[label] = PerformanceMonitor.getMetricStats(label)
        }

        return {
            timestamp: new Date().toISOString(),
            memoryUsage,
            bundleSize,
            metrics: allMetrics
        }
    }
}

// React hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
    if (process.env.NODE_ENV === 'development') {
        PerformanceMonitor.trackComponentRender(componentName)
    }

    return {
        startTiming: (label: string) => {
            try {
                return PerformanceMonitor.startTiming(`${componentName}-${label}`)
            } catch (error) {
                console.warn('Performance monitoring error:', error)
            }
        },
        endTiming: (label: string) => {
            try {
                return PerformanceMonitor.endTiming(`${componentName}-${label}`)
            } catch (error) {
                console.warn('Performance monitoring error:', error)
                return 0
            }
        },
        getMemoryUsage: () => {
            try {
                return PerformanceMonitor.getMemoryUsage()
            } catch (error) {
                console.warn('Memory usage monitoring error:', error)
                return null
            }
        },
        detectMemoryLeaks: () => {
            try {
                return PerformanceMonitor.detectMemoryLeaks()
            } catch (error) {
                console.warn('Memory leak detection error:', error)
            }
        }
    }
}

// Memory optimization utilities
export class MemoryOptimizer {
    // Debounce function to reduce function calls
    static debounce<T extends (...args: any[]) => any>(
        func: T,
        wait: number
    ): (...args: Parameters<T>) => void {
        let timeout: NodeJS.Timeout
        return (...args: Parameters<T>) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => func(...args), wait)
        }
    }

    // Throttle function to limit function calls
    static throttle<T extends (...args: any[]) => any>(
        func: T,
        limit: number
    ): (...args: Parameters<T>) => void {
        let inThrottle: boolean
        return (...args: Parameters<T>) => {
            if (!inThrottle) {
                func(...args)
                inThrottle = true
                setTimeout(() => inThrottle = false, limit)
            }
        }
    }

    // Memoization for expensive calculations
    static memoize<T extends (...args: any[]) => any>(func: T): T {
        const cache = new Map()
        return ((...args: Parameters<T>) => {
            const key = JSON.stringify(args)
            if (cache.has(key)) {
                return cache.get(key)
            }
            const result = func(...args)
            cache.set(key, result)
            return result
        }) as T
    }

    // Cleanup function for removing event listeners and timers
    static createCleanup() {
        const cleanupTasks: (() => void)[] = []

        return {
            add: (task: () => void) => cleanupTasks.push(task),
            cleanup: () => {
                cleanupTasks.forEach(task => {
                    try {
                        task()
                    } catch (error) {
                        console.error('Cleanup task failed:', error)
                    }
                })
                cleanupTasks.length = 0
            }
        }
    }
}