'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from './Skeleton'

interface LoadingStateProps {
    type?: 'spinner' | 'skeleton' | 'pulse' | 'dots'
    size?: 'sm' | 'md' | 'lg'
    text?: string
    className?: string
}

export function LoadingState({
    type = 'spinner',
    size = 'md',
    text,
    className
}: LoadingStateProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    }

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    }

    if (type === 'spinner') {
        return (
            <div className={cn('flex items-center justify-center space-x-2', className)}>
                <div
                    className={cn(
                        'border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin',
                        sizeClasses[size]
                    )}
                />
                {text && (
                    <span className={cn('text-primary-600', textSizeClasses[size])}>
                        {text}
                    </span>
                )}
            </div>
        )
    }

    if (type === 'pulse') {
        return (
            <div className={cn('flex items-center justify-center space-x-2', className)}>
                <div
                    className={cn(
                        'bg-primary-500 rounded-full animate-pulse',
                        sizeClasses[size]
                    )}
                />
                {text && (
                    <span className={cn('text-primary-600 animate-pulse', textSizeClasses[size])}>
                        {text}
                    </span>
                )}
            </div>
        )
    }

    if (type === 'dots') {
        return (
            <div className={cn('flex items-center justify-center space-x-1', className)}>
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={cn(
                            'bg-primary-500 rounded-full animate-bounce',
                            size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-2.5 h-2.5'
                        )}
                        style={{
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: '0.6s'
                        }}
                    />
                ))}
                {text && (
                    <span className={cn('ml-2 text-primary-600', textSizeClasses[size])}>
                        {text}
                    </span>
                )}
            </div>
        )
    }

    // Default to skeleton
    return (
        <div className={cn('space-y-2', className)}>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            {text && (
                <div className="text-center">
                    <span className={cn('text-primary-600', textSizeClasses[size])}>
                        {text}
                    </span>
                </div>
            )}
        </div>
    )
}

// Specific loading components for different use cases
export function PageLoadingState() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
                <p className="text-primary-600 font-medium">Memuat halaman...</p>
            </div>
        </div>
    )
}

export function CardLoadingState() {
    return (
        <div className="card p-6 space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex space-x-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
            </div>
        </div>
    )
}

export function TableLoadingState({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex space-x-4 pb-2 border-b border-primary-100">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex space-x-4 py-2">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton key={colIndex} className="h-4 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    )
}

export function ChartLoadingState() {
    return (
        <div className="card p-6">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="space-y-2">
                <Skeleton className="h-64 w-full" />
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        </div>
    )
}

export function ListLoadingState({ items = 5 }: { items?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border border-primary-100 rounded-lg">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                </div>
            ))}
        </div>
    )
}

// Loading overlay component
interface LoadingOverlayProps {
    isLoading: boolean
    children: React.ReactNode
    text?: string
    className?: string
}

export function LoadingOverlay({
    isLoading,
    children,
    text = 'Memuat...',
    className
}: LoadingOverlayProps) {
    return (
        <div className={cn('relative', className)}>
            {children}
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                    <LoadingState type="spinner" text={text} />
                </div>
            )}
        </div>
    )
}

// Hook for managing loading states
export function useLoadingState(initialState = false) {
    const [isLoading, setIsLoading] = React.useState(initialState)

    const startLoading = () => setIsLoading(true)
    const stopLoading = () => setIsLoading(false)
    const toggleLoading = () => setIsLoading(!isLoading)

    return {
        isLoading,
        startLoading,
        stopLoading,
        toggleLoading,
        setIsLoading,
    }
}