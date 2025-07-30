import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for updating a child
const updateChildSchema = z.object({
    name: z.string().min(1, 'Nama anak wajib diisi').max(100, 'Nama tidak boleh lebih dari 100 karakter').optional(),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    birthDate: z.string().refine((date) => {
        const birthDate = new Date(date)
        const now = new Date()
        const maxAge = new Date()
        maxAge.setFullYear(now.getFullYear() - 18) // Maximum 18 years old

        return birthDate <= now && birthDate >= maxAge
    }, 'Tanggal lahir tidak valid').optional(),
    relationship: z.string().min(1, 'Hubungan keluarga wajib diisi').max(50, 'Hubungan keluarga tidak boleh lebih dari 50 karakter').optional()
})

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = await params

        const child = await prisma.child.findFirst({
            where: {
                id,
                userId: session.user.id
            },
            select: {
                id: true,
                name: true,
                gender: true,
                birthDate: true,
                relationship: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        growthRecords: true,
                        immunizationRecords: true,
                        mpasiFavorites: true
                    }
                }
            }
        })

        if (!child) {
            return NextResponse.json(
                { error: 'Child not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            child: {
                ...child,
                growthRecordsCount: child._count.growthRecords,
                immunizationRecordsCount: child._count.immunizationRecords,
                mpasiFavoritesCount: child._count.mpasiFavorites
            }
        })
    } catch (error) {
        console.error('Error fetching child:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = await params

        // Check if child exists and belongs to user
        const existingChild = await prisma.child.findFirst({
            where: {
                id,
                userId: session.user.id
            }
        })

        if (!existingChild) {
            return NextResponse.json(
                { error: 'Child not found' },
                { status: 404 }
            )
        }

        const body = await request.json()

        // Validate input
        const validationResult = updateChildSchema.safeParse(body)
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validationResult.error.issues
                },
                { status: 400 }
            )
        }

        const updateData: Record<string, string | Date> = {}
        const { name, gender, birthDate, relationship } = validationResult.data

        if (name !== undefined) updateData.name = name.trim()
        if (gender !== undefined) updateData.gender = gender
        if (birthDate !== undefined) updateData.birthDate = new Date(birthDate)
        if (relationship !== undefined) updateData.relationship = relationship.trim()

        // Update the child
        const updatedChild = await prisma.child.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                gender: true,
                birthDate: true,
                relationship: true,
                updatedAt: true
            }
        })

        return NextResponse.json({
            child: updatedChild,
            message: 'Profil anak berhasil diperbarui'
        })
    } catch (error) {
        console.error('Error updating child:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = await params

        // Check if child exists and belongs to user
        const existingChild = await prisma.child.findFirst({
            where: {
                id,
                userId: session.user.id
            },
            select: {
                id: true,
                name: true,
                _count: {
                    select: {
                        growthRecords: true,
                        immunizationRecords: true
                    }
                }
            }
        })

        if (!existingChild) {
            return NextResponse.json(
                { error: 'Child not found' },
                { status: 404 }
            )
        }

        // Delete the child (cascade delete will handle related records)
        await prisma.child.delete({
            where: { id }
        })

        return NextResponse.json({
            message: `Profil ${existingChild.name} berhasil dihapus`
        })
    } catch (error) {
        console.error('Error deleting child:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}