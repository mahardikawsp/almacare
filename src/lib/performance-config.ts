// Performance configuration for BayiCare app
export const PERFORMANCE_CONFIG = {
    // Virtualization settings
    virtualization: {
        itemHeight: 72,
        containerHeight: 400,
        overscan: 5,
        threshold: 100, // Start virtualizing after 100 items
    },

    // Lazy loading settings
    lazyLoading: {
        rootMargin: '50px',
        threshold: 0.1,
        delay: 100,
    },

    // Bundle splitting thresholds
    bundleSplitting: {
        maxChunkSize: 500 * 1024, // 500KB
        minChunkSize: 20 * 1024,  // 20KB
        maxAsyncRequests: 30,
        maxInitialRequests: 25,
    },

    // Performance monitoring
    monitoring: {
        fpsThreshold: 50,
        loadTimeThreshold: 3000,
        renderTimeThreshold: 16,
        memoryThreshold: 50 * 1024 * 1024, // 50MB
    },

    // Component-specific optimizations
    components: {
        table: {
            virtualizeAfter: 50,
            pageSize: 25,
        },
        charts: {
            maxDataPoints: 100,
            animationDuration: 300,
        },
        images: {
            lazyLoad: true,
            placeholder: 'blur',
            quality: 85,
        },
    },
} as const

export type PerformanceConfig = typeof PERFORMANCE_CONFIG