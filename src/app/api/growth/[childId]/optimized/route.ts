import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DatabaseOptimizer } from '@/lib/db-optimization'
import { PerformanceMonitor } from '@/lib/performance-monitor'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { childId: string } }
) {
    try {
        PerformanceMonitor.startTiming('growth-api-optimized')

        // Verify authentication and child ownership
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify child belongs to user
        const child = await prisma.child.findFirst({
            where: {
                id: params.childId,
                userId: session.user.id
            },
            select: { id: true, name: true, birthDate: true }
        })

        if (!child) {
            return NextResponse.json({ error: 'Child not found' }, { status: 404 })
        }

        // Get query parameters
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        // Use optimized query
        const growthRecords = await DatabaseOptimizer.getGrowthChartData(
            params.childId,
            limit
        )

        // Calculate growth trends
        const trends = calculateGrowthTrends(growthRecords)

        const response = {
            child,
            records: growthRecords.slice(offset, offset + limit),
            trends,
            pagination: {
                total: growthRecords.length,
                limit,
                offset,
                hasMore: offset + limit < growthRecords.length
            },
            performance: {
                queryTime: PerformanceMonitor.endTiming('growth-api-optimized'),
                recordCount: growthRecords.length,
                timestamp: new Date().toISOString()
            }
        }

        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'private, max-age=600, stale-while-revalidate=1200', // 10 min cache
                'X-Performance-Time': response.performance.queryTime.toString(),
                'X-Record-Count': response.performance.recordCount.toString()
            }
        })

    } catch (error) {
        PerformanceMonitor.endTiming('growth-api-optimized')
        console.error('Growth API error:', error)

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

function calculateGrowthTrends(records: Array<{
    weight: number
    height: number
    weightForAgeZScore: number
}>) {
    if (records.length < 2) return null

    const latest = records[0]
    const previous = records[1]

    return {
        weight: {
            current: latest.weight,
            previous: previous.weight,
            change: latest.weight - previous.weight,
            trend: latest.weight > previous.weight ? 'up' : 'down'
        },
        height: {
            current: latest.height,
            previous: previous.height,
            change: latest.height - previous.height,
            trend: latest.height > previous.height ? 'up' : 'down'
        },
        weightForAge: {
            current: latest.weightForAgeZScore,
            previous: previous.weightForAgeZScore,
            change: latest.weightForAgeZScore - previous.weightForAgeZScore,
            trend: latest.weightForAgeZScore > previous.weightForAgeZScore ? 'up' : 'down'
        }
    }
}