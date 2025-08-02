"use client"

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from './skeleton'
import { usePerformanceOptimization } from './performance-utils'

interface PerformanceLoaderProps {
    children: React.ReactNode
    fallback?: React.ReactNode
    delay?: number
    minLoadTime?: number
    className?: string
}

export function PerformanceLoader({
    children,
    fallback,
    delay = 0,
    minLoadTime = 300,
    className
}: PerformanceLoaderProps) {
    const [isReady, setIsReady] = useState(delay === 0)
    const [showContent, setShowContent] = useState(false)
    const { elementRef, shouldRender } = usePerformanceOptimization()
    const startTime = useState(() => Date.now())[0]

    useEffect(() => {
        if (delay > 0) {
            const timer = setTimeout(() => setIsReady(true), delay)
            return () => clearTimeout(timer)
        }
    }, [delay])

    useEffect(() => {
        if (isReady && shouldRender) {
            const elapsed = Date.now() - startTime
            const remainingTime = Math.max(0, minLoadTime - elapsed)

            const timer = setTimeout(() => setShowContent(true), remainingTime)
            return () => clearTimeout(timer)
        }
    }, [isReady, shouldRender, startTime, minLoadTime])

    if (!showContent) {
        return (
            <div ref={elementRef} className={className}>
                {fallback || <Skeleton className="h-20 w-full" />}
            </div>
        )
    }

    return <div className={className}>{children}</div>
}

// Specialized loaders for different content types
export function CardLoader({ className }: { className?: string }) {
    return (
        <div className={cn("rounded-xl border border-[#EEF3FC] bg-white p-6 shadow-[0_2px_4px_-1px_rgba(4,163,232,0.05)]", className)}>
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-20 w-full mb-4" />
            <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
            </div>
        </div>
    )
}

export function TableLoader({ rows = 5, className }: { rows?: number; className?: string }) {
    return (
        <div className={cn("rounded-xl border border-[#EEF3FC] bg-white shadow-[0_2px_4px_-1px_rgba(4,163,232,0.05)]", className)}>
            <div className="p-4 space-y-3">
                {Array.from({ length: rows }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                ))}
            </div>
        </div>
    )
}

export function FormLoader({ fields = 3, className }: { fields?: number; className?: string }) {
    return (
        <div className={cn("space-y-4", className)}>
            {Array.from({ length: fields }).map((_, i) => (
                <div key={i}>
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
        </div>
    )
}

export function ChartLoader({ className }: { className?: string }) {
    return (
        <div className={cn("rounded-xl border border-[#EEF3FC] bg-white p-6 shadow-[0_2px_4px_-1px_rgba(4,163,232,0.05)]", className)}>
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="space-y-2">
                <Skeleton className="h-32 w-full" />
                <div className="flex justify-between">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-12" />
                </div>
            </div>
        </div>
    )
}

// Progressive loading component for complex layouts
export function ProgressiveLoader({
    stages,
    currentStage = 0,
    className
}: {
    stages: Array<{
        name: string
        component: React.ReactNode
        fallback?: React.ReactNode
    }>
    currentStage?: number
    className?: string
}) {
    return (
        <div className={className}>
            {stages.map((stage, index) => {
                if (index < currentStage) {
                    return <div key={stage.name}>{stage.component}</div>
                } else if (index === currentStage) {
                    return (
                        <PerformanceLoader
                            key={stage.name}
                            fallback={stage.fallback}
                            delay={index * 100} // Stagger loading
                        >
                            {stage.component}
                        </PerformanceLoader>
                    )
                }
                return stage.fallback || <Skeleton key={stage.name} className="h-20 w-full" />
            })}
        </div>
    )
}

// Adaptive loader that changes based on connection speed
export function AdaptiveLoader({
    children,
    fastFallback,
    slowFallback,
    className
}: {
    children: React.ReactNode
    fastFallback?: React.ReactNode
    slowFallback?: React.ReactNode
    className?: string
}) {
    const [connectionSpeed, setConnectionSpeed] = useState<'fast' | 'slow'>('fast')

    useEffect(() => {
        // Detect connection speed
        if ('connection' in navigator) {
            const connection = (navigator as { connection?: { effectiveType?: string } }).connection
            const effectiveType = connection?.effectiveType

            if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                setConnectionSpeed('slow')
            }
        }
    }, [])

    const fallback = connectionSpeed === 'slow' ? slowFallback : fastFallback

    return (
        <PerformanceLoader
            fallback={fallback}
            delay={connectionSpeed === 'slow' ? 500 : 100}
            minLoadTime={connectionSpeed === 'slow' ? 800 : 300}
            className={className}
        >
            {children}
        </PerformanceLoader>
    )
}