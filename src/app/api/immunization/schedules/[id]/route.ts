import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for updating immunization schedule
const updateImmunizationScheduleSchema = z.object({
    ageInMonths: z.number().min(0).max(60).optional(),
    vaccineName: z.string().min(1).max(100).optional(),
    vaccineType: z.string().min(1).max(100).optional(),
    isOptional: z.boolean().optional(),
    description: z.string().optional(),
    sortOrder: z.number().min(1).max(10).optional(),
    isActive: z.boolean().optional()
})

// GET /api/immunization/schedules/[id] - Get specific immunization schedule
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const resolvedParams = await params

        const schedule = await prisma.immunizationSchedule.findUnique({
            where: { id: resolvedParams.id }
        })

        if (!schedule) {
            return NextResponse.json(
                { error: 'Immunization schedule not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ schedule })
    } catch (error) {
        console.error('Error fetching immunization schedule:', error)
        return NextResponse.json(
            { error: 'Failed to fetch immunization schedule' },
            { status: 500 }
        )
    }
}

// PUT /api/immunization/schedules/[id] - Update immunization schedule (admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const resolvedParams = await params
        const body = await request.json()
        const validatedData = updateImmunizationScheduleSchema.parse(body)

        // Check if schedule exists
        const existingSchedule = await prisma.immunizationSchedule.findUnique({
            where: { id: resolvedParams.id }
        })

        if (!existingSchedule) {
            return NextResponse.json(
                { error: 'Immunization schedule not found' },
                { status: 404 }
            )
        }

        // If updating ageInMonths or vaccineName, check for conflicts
        if (validatedData.ageInMonths || validatedData.vaccineName) {
            const ageInMonths = validatedData.ageInMonths ?? existingSchedule.ageInMonths
            const vaccineName = validatedData.vaccineName ?? existingSchedule.vaccineName

            const conflictingSchedule = await prisma.immunizationSchedule.findUnique({
                where: {
                    ageInMonths_vaccineName: {
                        ageInMonths,
                        vaccineName
                    }
                }
            })

            if (conflictingSchedule && conflictingSchedule.id !== resolvedParams.id) {
                return NextResponse.json(
                    { error: 'Schedule with this age and vaccine name already exists' },
                    { status: 400 }
                )
            }
        }

        const schedule = await prisma.immunizationSchedule.update({
            where: { id: resolvedParams.id },
            data: validatedData
        })

        return NextResponse.json({ schedule })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid data', details: error.issues },
                { status: 400 }
            )
        }

        console.error('Error updating immunization schedule:', error)
        return NextResponse.json(
            { error: 'Failed to update immunization schedule' },
            { status: 500 }
        )
    }
}

// DELETE /api/immunization/schedules/[id] - Soft delete immunization schedule (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const resolvedParams = await params

        // Check if schedule exists
        const existingSchedule = await prisma.immunizationSchedule.findUnique({
            where: { id: resolvedParams.id }
        })

        if (!existingSchedule) {
            return NextResponse.json(
                { error: 'Immunization schedule not found' },
                { status: 404 }
            )
        }

        // Soft delete by setting isActive to false
        await prisma.immunizationSchedule.update({
            where: { id: resolvedParams.id },
            data: { isActive: false }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting immunization schedule:', error)
        return NextResponse.json(
            { error: 'Failed to delete immunization schedule' },
            { status: 500 }
        )
    }
}