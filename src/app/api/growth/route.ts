import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GrowthService } from '@/lib/growth-service'
import { z } from 'zod'

const createGrowthRecordSchema = z.object({
    childId: z.string().min(1, 'Child ID is required'),
    date: z.string().datetime('Invalid date format'),
    weight: z.number().min(0.1, 'Weight must be at least 0.1 kg').max(50, 'Weight must be less than 50 kg'),
    height: z.number().min(1, 'Height must be at least 1 cm').max(150, 'Height must be less than 150 cm'),
    headCircumference: z.number().min(1, 'Head circumference must be at least 1 cm').max(70, 'Head circumference must be less than 70 cm').optional()
})

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const validatedData = createGrowthRecordSchema.parse(body)

        const growthRecord = await GrowthService.createGrowthRecord(
            validatedData.childId,
            {
                date: new Date(validatedData.date),
                weight: validatedData.weight,
                height: validatedData.height,
                headCircumference: validatedData.headCircumference
            }
        )

        return NextResponse.json({
            success: true,
            data: growthRecord
        })
    } catch (error) {
        console.error('Error creating growth record:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json({
                success: false,
                error: 'Validation error',
                details: error.issues
            }, { status: 400 })
        }

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create growth record'
        }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const childId = searchParams.get('childId')

        if (!childId) {
            return NextResponse.json({
                success: false,
                error: 'Child ID is required'
            }, { status: 400 })
        }

        const records = await GrowthService.getChildGrowthRecords(childId)

        return NextResponse.json({
            success: true,
            data: records
        })
    } catch (error) {
        console.error('Error fetching growth records:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch growth records'
        }, { status: 500 })
    }
}