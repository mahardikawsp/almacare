'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
    text?: string
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
    return (
        <div className={cn('flex items-center justify-center', className)}>
            <div className="flex items-center space-x-2">
                <div
                    className={cn(
                        'border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin',
                        sizeClasses[size]
                    )}
                />
                {text && (
                    <span className="text-sm text-primary-600 font-medium">{text}</span>
                )}
            </div>
        </div>
    )
}

export function PageLoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
                <p className="text-primary-600 font-medium">Memuat halaman...</p>
            </div>
        </div>
    )
}