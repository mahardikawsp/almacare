import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GrowthService } from '@/lib/growth-service'
import { z } from 'zod'

const updateGrowthRecordSchema = z.object({
    date: z.string().datetime('Invalid date format').optional(),
    weight: z.number().min(0.1, 'Weight must be at least 0.1 kg').max(50, 'Weight must be less than 50 kg').optional(),
    height: z.number().min(1, 'Height must be at least 1 cm').max(150, 'Height must be less than 150 cm').optional(),
    headCircumference: z.number().min(1, 'Head circumference must be at least 1 cm').max(70, 'Head circumference must be less than 70 cm').optional()
})

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const validatedData = updateGrowthRecordSchema.parse(body)

        const updateData: {
            date?: Date
            weight?: number
            height?: number
            headCircumference?: number
        } = {}
        if (validatedData.date) updateData.date = new Date(validatedData.date)
        if (validatedData.weight !== undefined) updateData.weight = validatedData.weight
        if (validatedData.height !== undefined) updateData.height = validatedData.height
        if (validatedData.headCircumference !== undefined) updateData.headCircumference = validatedData.headCircumference

        const params = await context.params
        const growthRecord = await GrowthService.updateGrowthRecord(params.id, updateData)

        return NextResponse.json({
            success: true,
            data: growthRecord
        })
    } catch (error) {
        console.error('Error updating growth record:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json({
                success: false,
                error: 'Validation error',
                details: error.issues
            }, { status: 400 })
        }

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update growth record'
        }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const params = await context.params
        await GrowthService.deleteGrowthRecord(params.id)

        return NextResponse.json({
            success: true,
            message: 'Growth record deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting growth record:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete growth record'
        }, { status: 500 })
    }
}