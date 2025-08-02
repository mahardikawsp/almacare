import { NextRequest, NextResponse } from 'next/server'
import { PerformanceMonitor } from '../../../lib/performance-monitor'
import { DatabaseOptimizer } from '../../../lib/db-optimization'
import { checkDatabaseConnection } from '../../../lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const serverMemory = PerformanceMonitor.getServerMemoryUsage()
        const dbConnection = await checkDatabaseConnection()
        const connectionPool = await DatabaseOptimizer.getConnectionPoolStatus()

        const performanceData = {
            timestamp: new Date().toISOString(),
            server: {
                memory: serverMemory,
                uptime: process.uptime(),
                nodeVersion: process.version,
                platform: process.platform,
                arch: process.arch
            },
            database: {
                connection: dbConnection,
                connectionPool
            },
            environment: {
                nodeEnv: process.env.NODE_ENV,
                memoryLimit: process.env.NODE_OPTIONS?.includes('--max-old-space-size')
                    ? process.env.NODE_OPTIONS.match(/--max-old-space-size=(\d+)/)?.[1] + 'MB'
                    : 'Default'
            }
        }

        return NextResponse.json(performanceData)
    } catch (error) {
        console.error('Performance monitoring error:', error)
        return NextResponse.json(
            { error: 'Failed to get performance data' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const { action } = await request.json()

        switch (action) {
            case 'clear-metrics':
                PerformanceMonitor.clearMetrics()
                return NextResponse.json({ success: true, message: 'Metrics cleared' })

            case 'force-gc':
                if (global.gc) {
                    global.gc()
                    return NextResponse.json({ success: true, message: 'Garbage collection triggered' })
                } else {
                    return NextResponse.json({
                        success: false,
                        message: 'Garbage collection not available. Run with --expose-gc flag.'
                    })
                }

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
        }
    } catch (error) {
        console.error('Performance action error:', error)
        return NextResponse.json(
            { error: 'Failed to execute performance action' },
            { status: 500 }
        )
    }
}