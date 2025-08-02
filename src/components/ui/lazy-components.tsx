"use client"

import { lazy, Suspense } from 'react'
import { Skeleton } from './skeleton'

// Lazy load non-critical components
export const LazyGrowthChartCard = lazy(() =>
    import('./composite/growth-chart-card').then(module => ({
        default: module.GrowthChartCard
    }))
)

export const LazyImmunizationCard = lazy(() =>
    import('./composite/immunization-card').then(module => ({
        default: module.ImmunizationCard
    }))
)

export const LazyMPASICard = lazy(() =>
    import('./composite/mpasi-card').then(module => ({
        default: module.MPASICard
    }))
)

export const LazyDashboardStats = lazy(() =>
    import('./composite/dashboard-stats').then(module => ({
        default: module.DashboardStats
    }))
)

// Lazy load data display components
export const LazyResponsiveTable = lazy(() =>
    import('./responsive-table').then(module => ({
        default: module.ResponsiveTable
    }))
)

export const LazyGrowthTable = lazy(() =>
    import('./responsive-table').then(module => ({
        default: module.GrowthTable
    }))
)

export const LazyImmunizationTable = lazy(() =>
    import('./responsive-table').then(module => ({
        default: module.ImmunizationTable
    }))
)

// Lazy load form components
export const LazyInputField = lazy(() =>
    import('./form-fields').then(module => ({
        default: module.InputField
    }))
)

export const LazySelectField = lazy(() =>
    import('./select-field').then(module => ({
        default: module.SelectField
    }))
)

export const LazyTextareaField = lazy(() =>
    import('./textarea-field').then(module => ({
        default: module.TextareaField
    }))
)

// Loading fallback components
const CardSkeleton = () => (
    <div className="rounded-xl border border-[#EEF3FC] bg-white p-6 shadow-[0_2px_4px_-1px_rgba(4,163,232,0.05)]">
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-20 w-full mb-4" />
        <div className="flex justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
        </div>
    </div>
)

const TableSkeleton = () => (
    <div className="rounded-xl border border-[#EEF3FC] bg-white shadow-[0_2px_4px_-1px_rgba(4,163,232,0.05)]">
        <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
        </div>
    </div>
)

const FormSkeleton = () => (
    <div className="space-y-4">
        <div>
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div>
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div>
            <Skeleton className="h-4 w-1/5 mb-2" />
            <Skeleton className="h-20 w-full" />
        </div>
    </div>
)

// Wrapper components with suspense
export function LazyGrowthChartCardWithSuspense(props: Record<string, unknown>) {
    return (
        <Suspense fallback={<CardSkeleton />}>
            <LazyGrowthChartCard {...(props as any)} />
        </Suspense>
    )
}

export function LazyImmunizationCardWithSuspense(props: Record<string, unknown>) {
    return (
        <Suspense fallback={<CardSkeleton />}>
            <LazyImmunizationCard {...(props as any)} />
        </Suspense>
    )
}

export function LazyMPASICardWithSuspense(props: Record<string, unknown>) {
    return (
        <Suspense fallback={<CardSkeleton />}>
            <LazyMPASICard {...(props as any)} />
        </Suspense>
    )
}

export function LazyDashboardStatsWithSuspense(props: Record<string, unknown>) {
    return (
        <Suspense fallback={<CardSkeleton />}>
            <LazyDashboardStats {...(props as any)} />
        </Suspense>
    )
}

export function LazyResponsiveTableWithSuspense(props: Record<string, unknown>) {
    return (
        <Suspense fallback={<TableSkeleton />}>
            <LazyResponsiveTable {...(props as any)} />
        </Suspense>
    )
}

export function LazyGrowthTableWithSuspense(props: Record<string, unknown>) {
    return (
        <Suspense fallback={<TableSkeleton />}>
            <LazyGrowthTable {...(props as any)} />
        </Suspense>
    )
}

export function LazyImmunizationTableWithSuspense(props: Record<string, unknown>) {
    return (
        <Suspense fallback={<TableSkeleton />}>
            <LazyImmunizationTable {...(props as any)} />
        </Suspense>
    )
}

export function LazyInputFieldWithSuspense(props: Record<string, unknown>) {
    return (
        <Suspense fallback={<FormSkeleton />}>
            <LazyInputField {...(props as any)} />
        </Suspense>
    )
}

export function LazySelectFieldWithSuspense(props: Record<string, unknown>) {
    return (
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
            <LazySelectField {...(props as any)} />
        </Suspense>
    )
}

export function LazyTextareaFieldWithSuspense(props: Record<string, unknown>) {
    return (
        <Suspense fallback={<Skeleton className="h-20 w-full" />}>
            <LazyTextareaField {...(props as any)} />
        </Suspense>
    )
}