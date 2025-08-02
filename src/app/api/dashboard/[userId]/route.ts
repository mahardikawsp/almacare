import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DatabaseOptimizer } from '@/lib/db-optimization'
import { PerformanceMonitor } from '@/lib/performance-monitor'

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        // Start performance monitoring
        PerformanceMonitor.startTiming('dashboard-api')

        // Verify authentication
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.id !== params.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Use optimized database query
        const dashboardData = await DatabaseOptimizer.getDashboardData(params.userId)

        // Calculate additional metrics
        const metrics = {
            totalChildren: dashboardData.children.length,
            totalGrowthRecords: dashboardData.children.reduce(
                (sum, child) => sum + child._count.growthRecords, 0
            ),
            completedImmunizations: dashboardData.children.reduce(
                (sum, child) => sum + child._count.immunizationRecords, 0
            ),
            upcomingImmunizations: dashboardData.upcomingImmunizations.length,
            lastUpdated: new Date().toISOString()
        }

        const response = {
            ...dashboardData,
            metrics,
            performance: {
                queryTime: PerformanceMonitor.endTiming('dashboard-api'),
                timestamp: new Date().toISOString()
            }
        }

        // Set cache headers for performance
        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'private, max-age=300, stale-while-revalidate=600', // 5 min cache, 10 min stale
                'X-Performance-Time': response.performance.queryTime.toString()
            }
        })

    } catch (error) {
        PerformanceMonitor.endTiming('dashboard-api')
        console.error('Dashboard API error:', error)

        return NextResponse.json(
            {
                error: 'Internal server error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        )
    }
}