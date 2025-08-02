// Core UI Components (always loaded)
export { Button, type ButtonProps } from './button'
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
export { Input, type InputProps } from './input'
export { Label } from './label'
export { Skeleton } from './skeleton'

// Lazy-loaded component groups for better code splitting
export {
    LazyFormComponents,
    LazyDataDisplayComponents,
    LazyLayoutComponents,
    LazyHealthComponents,
    LazyFeedbackComponents,
    type FormComponentsProps,
    type DataDisplayProps,
    type LayoutComponentsProps,
    type HealthComponentsProps,
    type FeedbackComponentsProps
} from './component-groups'

// Individual lazy components for fine-grained loading
export {
    LazyGrowthChartCardWithSuspense,
    LazyImmunizationCardWithSuspense,
    LazyMPASICardWithSuspense,
    LazyDashboardStatsWithSuspense,
    LazyResponsiveTableWithSuspense,
    LazyGrowthTableWithSuspense,
    LazyImmunizationTableWithSuspense,
    LazyInputFieldWithSuspense,
    LazySelectFieldWithSuspense,
    LazyTextareaFieldWithSuspense
} from './lazy-components'

// Virtualized components for performance
export {
    VirtualizedList,
    VirtualizedGrowthList,
    VirtualizedImmunizationList,
    useVirtualizedList
} from './virtualized-list'

// Layout components
export type { ResponsiveContainerProps, SafeAreaWrapperProps, MobileNavProps, MobileNavItem } from './layout'

// Composite component types
export type { StatItem } from './composite'

// Performance utilities
export { usePerformanceOptimization } from './performance-utils'
export { PerformanceMonitor, PerformanceWarning } from './performance-monitor'
export {
    PerformanceLoader,
    CardLoader,
    TableLoader,
    FormLoader,
    ChartLoader,
    ProgressiveLoader,
    AdaptiveLoader
} from './performance-loader'
export { OptimizedImage, OptimizedAvatar, OptimizedIcon } from './optimized-image'

// Performance hooks
export {
    usePerformanceOptimizations,
    useListOptimization,
    useRenderOptimization,
    useImageOptimization,
    useAPIOptimization,
    useAnimationOptimization,
    useBundleOptimization
} from '../../hooks/usePerformanceOptimizations'