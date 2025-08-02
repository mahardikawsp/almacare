import { prisma } from './prisma'

// Query optimization utilities
export class DatabaseOptimizer {
    // Batch operations to reduce database round trips
    static async batchGrowthRecords(childId: string, records: any[]) {
        return await prisma.$transaction(
            records.map(record =>
                prisma.growthRecord.create({
                    data: {
                        ...record,
                        childId
                    }
                })
            )
        )
    }

    // Optimized query for dashboard data
    static async getDashboardData(userId: string) {
        const [children, recentGrowthRecords, upcomingImmunizations] = await Promise.all([
            // Get children with latest growth record
            prisma.child.findMany({
                where: { userId },
                include: {
                    growthRecords: {
                        orderBy: { date: 'desc' },
                        take: 1
                    },
                    _count: {
                        select: {
                            growthRecords: true,
                            immunizationRecords: {
                                where: { status: 'COMPLETED' }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),

            // Get recent growth records across all children
            prisma.growthRecord.findMany({
                where: {
                    child: { userId }
                },
                include: {
                    child: {
                        select: { name: true, id: true }
                    }
                },
                orderBy: { date: 'desc' },
                take: 10
            }),

            // Get upcoming immunizations
            prisma.immunizationRecord.findMany({
                where: {
                    child: { userId },
                    status: 'SCHEDULED',
                    scheduledDate: {
                        gte: new Date(),
                        lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
                    }
                },
                include: {
                    child: {
                        select: { name: true, id: true }
                    },
                    schedule: {
                        select: { vaccineName: true, vaccineType: true }
                    }
                },
                orderBy: { scheduledDate: 'asc' },
                take: 5
            })
        ])

        return {
            children,
            recentGrowthRecords,
            upcomingImmunizations
        }
    }

    // Optimized query for growth charts
    static async getGrowthChartData(childId: string, limit = 50) {
        return await prisma.growthRecord.findMany({
            where: { childId },
            select: {
                id: true,
                date: true,
                weight: true,
                height: true,
                headCircumference: true,
                weightForAgeZScore: true,
                heightForAgeZScore: true,
                weightForHeightZScore: true,
                headCircumferenceZScore: true
            },
            orderBy: { date: 'desc' },
            take: limit
        })
    }

    // Optimized MPASI recipe search
    static async searchMPASIRecipes(ageInMonths: number, texture?: string, limit = 20) {
        const where: any = {
            ageRangeMin: { lte: ageInMonths },
            ageRangeMax: { gte: ageInMonths }
        }

        if (texture) {
            where.texture = texture
        }

        return await prisma.mPASIRecipe.findMany({
            where,
            select: {
                id: true,
                name: true,
                ageRangeMin: true,
                ageRangeMax: true,
                texture: true,
                nutrition: true,
                imageUrl: true
            },
            take: limit,
            orderBy: { createdAt: 'desc' }
        })
    }

    // Connection pool status
    static async getConnectionPoolStatus() {
        try {
            const result = await prisma.$queryRaw`
        SELECT 
          count(*) as total_connections,
          count(*) FILTER (WHERE state = 'active') as active_connections,
          count(*) FILTER (WHERE state = 'idle') as idle_connections
        FROM pg_stat_activity 
        WHERE datname = current_database()
      ` as any[]

            return result[0] || { total_connections: 0, active_connections: 0, idle_connections: 0 }
        } catch (error) {
            console.error('Failed to get connection pool status:', error)
            return { total_connections: 0, active_connections: 0, idle_connections: 0 }
        }
    }
}