"use client"

// Health Components Group - Lazy loaded bundle
export { GrowthChartCard } from './composite/growth-chart-card'
export { ImmunizationCard } from './composite/immunization-card'
export { MPASICard } from './composite/mpasi-card'
export { QuickActionCard } from './composite/quick-action-card'
export { DashboardStats } from './composite/dashboard-stats'

// Default export for lazy loading
export function HealthComponentsGroup({ children }: { children?: React.ReactNode }) {
    return <div>{children}</div>
}

export default HealthComponentsGroup