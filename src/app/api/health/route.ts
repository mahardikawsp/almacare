import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // Test database connection
        await prisma.$queryRaw`SELECT 1`

        const healthData = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: 'connected',
            version: '1.0.0',
            environment: {
                nodeEnv: process.env.NODE_ENV,
                hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
                hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
                hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                hasVapidKeys: !!(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY)
            },
            deployment: {
                vercelUrl: process.env.VERCEL_URL || null,
                railwayUrl: process.env.RAILWAY_STATIC_URL || null,
                renderUrl: process.env.RENDER_EXTERNAL_URL || null
            }
        }

        return NextResponse.json(healthData)
    } catch (error) {
        console.error('Health check failed:', error)

        return NextResponse.json(
            {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                database: 'disconnected',
                error: error instanceof Error ? error.message : 'Database connection failed',
                environment: {
                    nodeEnv: process.env.NODE_ENV,
                    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
                    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
                    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
                    hasDatabaseUrl: !!process.env.DATABASE_URL
                }
            },
            { status: 503 }
        )
    }
}