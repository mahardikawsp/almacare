import { lazy } from 'react'

// Lazy load heavy components - these should have default exports
export const LazyDashboardCharts = lazy(() => import('../dashboard/DashboardCharts'))

// For components with named exports, create wrapper components or use dynamic imports
export const LazyGrowthChart = lazy(() =>
    import('../growth/GrowthChart').then(module => ({
        default: module.GrowthChart || module.default
    }))
)

export const LazyImmunizationCalendar = lazy(() =>
    import('../immunization/ImmunizationCalendar').then(module => ({
        default: module.ImmunizationCalendar || module.default
    }))
)

export const LazyMPASIRecipeList = lazy(() =>
    import('../mpasi/MPASIRecipeList').then(module => ({
        default: module.MPASIRecipeList || module.default
    }))
)

export const LazyReportGenerator = lazy(() =>
    import('../reports/ReportGenerator').then(module => ({
        default: module.ReportGenerator || module.default
    }))
)

// Lazy load pages - these should have default exports
export const LazyGrowthPage = lazy(() => import('../../app/growth/page'))
export const LazyImmunizationPage = lazy(() => import('../../app/immunization/page'))
export const LazyMPASIPage = lazy(() => import('../../app/mpasi/page'))
export const LazyReportsPage = lazy(() => import('../../app/reports/page'))