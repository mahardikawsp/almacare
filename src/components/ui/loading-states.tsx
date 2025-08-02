"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton, SkeletonCard } from "./skeleton"
import { LoadingSpinner } from "./progress"

/**
 * Loading state for button components
 */
interface ButtonLoadingProps {
    /**
     * Whether the button is in loading state
     */
    loading?: boolean
    /**
     * Size of the loading spinner
     */
    size?: "sm" | "default" | "lg"
    /**
     * Loading text to display
     */
    loadingText?: string
    /**
     * Additional CSS classes
     */
    className?: string
    /**
     * Children to render when not loading
     */
    children: React.ReactNode
}

function ButtonLoading({
    loading = false,
    size = "default",
    loadingText = "Loading...",
    className,
    children
}: ButtonLoadingProps) {
    if (!loading) return <>{children}</>

    const spinnerSize = size === "sm" ? "sm" : size === "lg" ? "default" : "sm"

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <LoadingSpinner size={spinnerSize} label={loadingText} />
            <span className="sr-only">{loadingText}</span>
            {loadingText && <span aria-hidden="true">{loadingText}</span>}
        </div>
    )
}

/**
 * Loading state for dashboard components
 */
function DashboardLoading({ className }: { className?: string }) {
    return (
        <div className={cn("space-y-6 p-4", className)} role="status" aria-label="Loading dashboard">
            {/* Welcome section */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" aria-label="Loading welcome message" />
                <Skeleton className="h-4 w-48" aria-label="Loading subtitle" />
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4 bg-card rounded-lg border space-y-3">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton variant="circular" className="h-8 w-8" />
                        </div>
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-32" aria-label="Loading quick actions title" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-4 bg-card rounded-lg border text-center space-y-2">
                            <Skeleton variant="circular" className="h-12 w-12 mx-auto" />
                            <Skeleton className="h-4 w-20 mx-auto" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent activity */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-40" aria-label="Loading recent activity title" />
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonCard key={i} showAvatar />
                    ))}
                </div>
            </div>
        </div>
    )
}

/**
 * Loading state for growth chart components
 */
function GrowthChartLoading({ className }: { className?: string }) {
    return (
        <div className={cn("space-y-4", className)} role="status" aria-label="Loading growth chart">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-9 w-24" />
            </div>

            <div className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" aria-label="Loading chart area" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="text-center space-y-2">
                            <Skeleton className="h-3 w-16 mx-auto" />
                            <Skeleton className="h-6 w-20 mx-auto" />
                            <Skeleton className="h-3 w-12 mx-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/**
 * Loading state for immunization schedule
 */
function ImmunizationLoading({ className }: { className?: string }) {
    return (
        <div className={cn("space-y-4", className)} role="status" aria-label="Loading immunization schedule">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-9 w-32" />
            </div>

            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                        <div className="flex items-center space-x-3">
                            <Skeleton variant="circular" className="h-10 w-10" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                        <div className="text-right space-y-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

/**
 * Loading state for MPASI (complementary feeding) components
 */
function MPASILoading({ className }: { className?: string }) {
    return (
        <div className={cn("space-y-4", className)} role="status" aria-label="Loading MPASI information">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-9 w-28" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recipe cards */}
                <div className="space-y-4">
                    <Skeleton className="h-5 w-32" />
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="p-3 bg-card rounded-lg border space-y-2">
                                <Skeleton className="h-20 w-full rounded" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-3/4" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nutrition info */}
                <div className="space-y-4">
                    <Skeleton className="h-5 w-36" />
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-card rounded border">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Loading state for form components
 */
function FormLoading({
    fields = 3,
    showSubmit = true,
    className
}: {
    fields?: number
    showSubmit?: boolean
    className?: string
}) {
    return (
        <div className={cn("space-y-6", className)} role="status" aria-label="Loading form">
            {Array.from({ length: fields }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" aria-label={`Loading field label ${i + 1}`} />
                    <Skeleton className="h-10 w-full rounded-md" aria-label={`Loading field input ${i + 1}`} />
                </div>
            ))}

            {showSubmit && (
                <div className="flex gap-3 pt-4">
                    <Skeleton className="h-10 w-24 rounded-md" />
                    <Skeleton className="h-10 w-20 rounded-md" />
                </div>
            )}
        </div>
    )
}

/**
 * Loading state for table components
 */
function TableLoading({
    rows = 5,
    columns = 4,
    showHeader = true,
    className
}: {
    rows?: number
    columns?: number
    showHeader?: boolean
    className?: string
}) {
    return (
        <div className={cn("space-y-4", className)} role="status" aria-label="Loading table">
            {showHeader && (
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                    {Array.from({ length: columns }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-20" aria-label={`Loading column header ${i + 1}`} />
                    ))}
                </div>
            )}

            <div className="space-y-3">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="grid gap-4 p-3 bg-card rounded border"
                        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                    >
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <Skeleton
                                key={colIndex}
                                className="h-4"
                                aria-label={`Loading row ${rowIndex + 1}, column ${colIndex + 1}`}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

/**
 * Generic page loading component
 */
function PageLoading({
    title,
    showBreadcrumb = false,
    className
}: {
    title?: string
    showBreadcrumb?: boolean
    className?: string
}) {
    return (
        <div className={cn("space-y-6 p-4", className)} role="status" aria-label="Loading page">
            {showBreadcrumb && (
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-16" />
                    <span className="text-muted-foreground">/</span>
                    <Skeleton className="h-4 w-20" />
                </div>
            )}

            <div className="space-y-2">
                <Skeleton className="h-8 w-48" aria-label="Loading page title" />
                {title && <Skeleton className="h-4 w-64" aria-label="Loading page description" />}
            </div>

            <div className="space-y-4">
                <SkeletonCard showActions />
                <SkeletonCard />
                <SkeletonCard showAvatar />
            </div>
        </div>
    )
}

export {
    ButtonLoading,
    DashboardLoading,
    GrowthChartLoading,
    ImmunizationLoading,
    MPASILoading,
    FormLoading,
    TableLoading,
    PageLoading
}