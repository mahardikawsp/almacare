import { Suspense, ReactNode } from 'react'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface LazyWrapperProps {
    children: ReactNode
    fallback?: ReactNode
}

export function LazyWrapper({ children, fallback }: LazyWrapperProps) {
    return (
        <Suspense fallback={fallback || <LoadingSpinner />}>
            {children}
        </Suspense>
    )
}

// Specific loading components for different sections
export function ChartLoadingSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
    )
}

export function ListLoadingSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export function CardLoadingSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
            </div>
        </div>
    )
}