import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for creating/updating immunization schedule
const immunizationScheduleSchema = z.object({
    ageInMonths: z.number().min(0).max(60),
    vaccineName: z.string().min(1).max(100),
    vaccineType: z.string().min(1).max(100),
    isOptional: z.boolean().default(false),
    description: z.string().optional(),
    sortOrder: z.number().min(1).max(10),
    isActive: z.boolean().default(true)
})

// GET /api/immunization/schedules - Get all immunization schedules
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const schedules = await prisma.immunizationSchedule.findMany({
            where: { isActive: true },
            orderBy: [
                { ageInMonths: 'asc' },
                { sortOrder: 'asc' }
            ]
        })

        return NextResponse.json({ schedules })
    } catch (error) {
        console.error('Error fetching immunization schedules:', error)
        return NextResponse.json(
            { error: 'Failed to fetch immunization schedules' },
            { status: 500 }
        )
    }
}

// POST /api/immunization/schedules - Create new immunization schedule (admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const validatedData = immunizationScheduleSchema.parse(body)

        // Check if schedule with same age and vaccine name already exists
        const existingSchedule = await prisma.immunizationSchedule.findUnique({
            where: {
                ageInMonths_vaccineName: {
                    ageInMonths: validatedData.ageInMonths,
                    vaccineName: validatedData.vaccineName
                }
            }
        })

        if (existingSchedule) {
            return NextResponse.json(
                { error: 'Schedule with this age and vaccine name already exists' },
                { status: 400 }
            )
        }

        const schedule = await prisma.immunizationSchedule.create({
            data: validatedData
        })

        return NextResponse.json({ schedule }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid data', details: error.errors },
                { status: 400 }
            )
        }

        console.error('Error creating immunization schedule:', error)
        return NextResponse.json(
            { error: 'Failed to create immunization schedule' },
            { status: 500 }
        )
    }
}