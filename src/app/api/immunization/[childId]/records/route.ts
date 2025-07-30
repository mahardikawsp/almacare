import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ childId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { childId } = await params

        // Verify that the child belongs to the current user
        const child = await prisma.child.findFirst({
            where: {
                id: childId,
                userId: session.user.id
            }
        })

        if (!child) {
            return NextResponse.json({ error: 'Child not found' }, { status: 404 })
        }

        // Fetch immunization records for the child
        const records = await prisma.immunizationRecord.findMany({
            where: { childId },
            include: {
                schedule: {
                    select: {
                        id: true,
                        ageInMonths: true,
                        vaccineName: true,
                        vaccineType: true,
                        isOptional: true,
                        description: true,
                        sortOrder: true
                    }
                }
            },
            orderBy: [
                { schedule: { ageInMonths: 'asc' } },
                { schedule: { sortOrder: 'asc' } }
            ]
        })

        return NextResponse.json({
            success: true,
            records
        })
    } catch (error) {
        console.error('Error fetching immunization records:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch immunization records'
        }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ childId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { childId } = await params
        const body = await request.json()
        const { recordId, status, actualDate, notes } = body

        // Verify that the child belongs to the current user
        const child = await prisma.child.findFirst({
            where: {
                id: childId,
                userId: session.user.id
            }
        })

        if (!child) {
            return NextResponse.json({ error: 'Child not found' }, { status: 404 })
        }

        // Update the immunization record
        const updatedRecord = await prisma.immunizationRecord.update({
            where: { id: recordId },
            data: {
                status,
                actualDate: actualDate ? new Date(actualDate) : null,
                notes
            },
            include: {
                schedule: true
            }
        })

        return NextResponse.json({
            success: true,
            record: updatedRecord
        })
    } catch (error) {
        console.error('Error updating immunization record:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to update immunization record'
        }, { status: 500 })
    }
}