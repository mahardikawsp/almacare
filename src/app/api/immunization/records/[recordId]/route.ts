import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ImmunizationService } from '@/lib/immunization-service'
import { z } from 'zod'

// Schema for updating immunization record
const updateImmunizationRecordSchema = z.object({
    status: z.enum(['SCHEDULED', 'COMPLETED', 'OVERDUE', 'SKIPPED']),
    actualDate: z.string().datetime().optional(),
    notes: z.string().max(500).optional()
})

// PUT /api/immunization/records/[recordId] - Update immunization record
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ recordId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const resolvedParams = await params

        // Verify record exists and belongs to user's child
        const existingRecord = await prisma.immunizationRecord.findUnique({
            where: { id: resolvedParams.recordId },
            include: {
                child: true,
                schedule: true
            }
        })

        if (!existingRecord) {
            return NextResponse.json(
                { error: 'Immunization record not found' },
                { status: 404 }
            )
        }

        if (existingRecord.child.userId !== session.user.id) {
            return NextResponse.json(
                { error: 'Access denied' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const validatedData = updateImmunizationRecordSchema.parse(body)

        // Convert actualDate string to Date if provided
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

        const updatedRecord = await ImmunizationService.updateImmunizationRecord(
            resolvedParams.recordId,
            updateData
        )

        return NextResponse.json({ record: updatedRecord })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid data', details: error.issues },
                { status: 400 }
            )
        }

        console.error('Error updating immunization record:', error)
        return NextResponse.json(
            { error: 'Failed to update immunization record' },
            { status: 500 }
        )
    }
}

// GET /api/immunization/records/[recordId] - Get specific immunization record
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ recordId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const resolvedParams = await params

        const record = await prisma.immunizationRecord.findUnique({
            where: { id: resolvedParams.recordId },
            include: {
                child: true,
                schedule: true
            }
        })

        if (!record) {
            return NextResponse.json(
                { error: 'Immunization record not found' },
                { status: 404 }
            )
        }

        if (record.child.userId !== session.user.id) {
            return NextResponse.json(
                { error: 'Access denied' },
                { status: 403 }
            )
        }

        return NextResponse.json({ record })
    } catch (error) {
        console.error('Error fetching immunization record:', error)
        return NextResponse.json(
            { error: 'Failed to fetch immunization record' },
            { status: 500 }
        )
    }
}