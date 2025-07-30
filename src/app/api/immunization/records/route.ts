import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for bulk updating immunization records
const bulkUpdateSchema = z.object({
    recordIds: z.array(z.string()),
    status: z.enum(['SCHEDULED', 'COMPLETED', 'OVERDUE', 'SKIPPED']),
    actualDate: z.string().datetime().optional(),
    notes: z.string().max(500).optional()
})

// GET /api/immunization/records - Get all immunization records for user's children
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const childId = searchParams.get('childId')
        const status = searchParams.get('status')

        const whereClause: {
            child: { userId: string }
            childId?: string
            status?: 'SCHEDULED' | 'COMPLETED' | 'OVERDUE' | 'SKIPPED'
        } = {
            child: {
                userId: session.user.id
            }
        }

        if (childId) {
            whereClause.childId = childId
        }

        if (status && ['SCHEDULED', 'COMPLETED', 'OVERDUE', 'SKIPPED'].includes(status)) {
            whereClause.status = status as 'SCHEDULED' | 'COMPLETED' | 'OVERDUE' | 'SKIPPED'
        }

        const records = await prisma.immunizationRecord.findMany({
            where: whereClause,
            include: {
                schedule: true,
                child: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                scheduledDate: 'asc'
            }
        })

        return NextResponse.json({ records })
    } catch (error) {
        console.error('Error fetching immunization records:', error)
        return NextResponse.json(
            { error: 'Failed to fetch immunization records' },
            { status: 500 }
        )
    }
}

// PUT /api/immunization/records - Bulk update immunization records
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const validatedData = bulkUpdateSchema.parse(body)

        // Verify all records belong to user's children
        const records = await prisma.immunizationRecord.findMany({
            where: {
                id: { in: validatedData.recordIds },
                child: {
                    userId: session.user.id
                }
            }
        })

        if (records.length !== validatedData.recordIds.length) {
            return NextResponse.json(
                { error: 'Some records not found or access denied' },
                { status: 403 }
            )
        }

        // Prepare update data
        const updateData: {
            status: 'SCHEDULED' | 'COMPLETED' | 'OVERDUE' | 'SKIPPED'
            notes?: string
            actualDate?: Date
        } = {
            status: validatedData.status,
            notes: validatedData.notes
        }

        if (validatedData.actualDate) {
            updateData.actualDate = new Date(validatedData.actualDate)
        }

        // If marking as completed, set actualDate to now if not provided
        if (validatedData.status === 'COMPLETED' && !validatedData.actualDate) {
            updateData.actualDate = new Date()
        }

        // Bulk update records
        const updatedRecords = await prisma.immunizationRecord.updateMany({
            where: {
                id: { in: validatedData.recordIds }
            },
            data: updateData
        })

        return NextResponse.json({
            message: `${updatedRecords.count} records updated successfully`,
            updatedCount: updatedRecords.count
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid data', details: error.issues },
                { status: 400 }
            )
        }

        console.error('Error bulk updating immunization records:', error)
        return NextResponse.json(
            { error: 'Failed to update immunization records' },
            { status: 500 }
        )
    }
}