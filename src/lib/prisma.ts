import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Connection pooling configuration optimized for 4GB RAM
const createPrismaClient = () => {
    return new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

// Connection pool monitoring
export async function checkDatabaseConnection() {
    try {
        await prisma.$queryRaw`SELECT 1`
        return { status: 'connected', timestamp: new Date() }
    } catch (error) {
        console.error('Database connection failed:', error)
        return { status: 'disconnected', error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date() }
    }
}

// Graceful shutdown
export async function disconnectDatabase() {
    await prisma.$disconnect()
}