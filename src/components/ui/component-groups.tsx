"use client"

import { lazy, Suspense } from 'react'
import { Skeleton } from './skeleton'

// Core UI Components Group (always loaded)
export * from './button'
export * from './card'
export * from './input'
export * from './label'

// Form Components Group (lazy loaded)
const FormComponentsGroup = lazy(() =>
    import('./form-components-group').then(module => ({
        default: module.FormComponentsGroup
    }))
)

// Data Display Components Group (lazy loaded)
const DataDisplayGroup = lazy(() =>
    import('./data-display-group').then(module => ({
        default: module.DataDisplayGroup
    }))
)

// Layout Components Group (lazy loaded)
const LayoutComponentsGroup = lazy(() =>
    import('./layout-components-group').then(module => ({
        default: module.LayoutComponentsGroup
    }))
)

// Health Components Group (lazy loaded)
const HealthComponentsGroup = lazy(() =>
    import('./health-components-group').then(module => ({
        default: module.HealthComponentsGroup
    }))
)

// Feedback Components Group (lazy loaded)
const FeedbackComponentsGroup = lazy(() =>
    import('./feedback-components-group').then(module => ({
        default: module.FeedbackComponentsGroup
    }))
)

// Loading fallbacks for different component groups
const FormGroupSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
    </div>
)

const DataDisplaySkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
    </div>
)

const LayoutSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-64 w-full" />
    </div>
)

const HealthSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
    </div>
)

const FeedbackSkeleton = () => (
    <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-3/4" />
    </div>
)

// Wrapper components with suspense for each group
export function LazyFormComponents(props: ComponentGroupProps) {
    return (
        <Suspense fallback={<FormGroupSkeleton />}>
            <FormComponentsGroup {...props} />
        </Suspense>
    )
}

export function LazyDataDisplayComponents(props: ComponentGroupProps) {
    return (
        <Suspense fallback={<DataDisplaySkeleton />}>
            <DataDisplayGroup {...props} />
        </Suspense>
    )
}

export function LazyLayoutComponents(props: ComponentGroupProps) {
    return (
        <Suspense fallback={<LayoutSkeleton />}>
            <LayoutComponentsGroup {...props} />
        </Suspense>
    )
}

export function LazyHealthComponents(props: ComponentGroupProps) {
    return (
        <Suspense fallback={<HealthSkeleton />}>
            <HealthComponentsGroup {...props} />
        </Suspense>
    )
}

export function LazyFeedbackComponents(props: ComponentGroupProps) {
    return (
        <Suspense fallback={<FeedbackSkeleton />}>
            <FeedbackComponentsGroup {...props} />
        </Suspense>
    )
}

// Component group type definitions
export interface ComponentGroupProps {
    children?: React.ReactNode
    className?: string
}

// Re-export types for better tree shaking
export type { ComponentGroupProps as FormComponentsProps }
export type { ComponentGroupProps as DataDisplayProps }
export type { ComponentGroupProps as LayoutComponentsProps }
export type { ComponentGroupProps as HealthComponentsProps }
export type { ComponentGroupProps as FeedbackComponentsProps }