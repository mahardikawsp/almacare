import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateChildImmunizationRecords } from '@/lib/immunization-service'
import { z } from 'zod'

// Validation schema for creating a child
const createChildSchema = z.object({
    name: z.string().min(1, 'Nama anak wajib diisi').max(100, 'Nama tidak boleh lebih dari 100 karakter'),
    gender: z.enum(['MALE', 'FEMALE']),
    birthDate: z.string().refine((date) => {
        const birthDate = new Date(date)
        const now = new Date()
        const maxAge = new Date()
        maxAge.setFullYear(now.getFullYear() - 18) // Maximum 18 years old

        return birthDate <= now && birthDate >= maxAge
    }, 'Tanggal lahir tidak valid'),
    relationship: z.string().min(1, 'Hubungan keluarga wajib diisi').max(50, 'Hubungan keluarga tidak boleh lebih dari 50 karakter')
})

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const children = await prisma.child.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                name: true,
                gender: true,
                birthDate: true,
                relationship: true,
                createdAt: true,
                _count: {
                    select: {
                        growthRecords: true,
                        immunizationRecords: true
                    }
                }
            }
        })

        return NextResponse.json({
            children: children.map(child => ({
                ...child,
                growthRecordsCount: child._count.growthRecords,
                immunizationRecordsCount: child._count.immunizationRecords
            }))
        })
    } catch (error) {
        console.error('Error fetching children:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()

        // Validate input
        const validationResult = createChildSchema.safeParse(body)
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validationResult.error.issues
                },
                { status: 400 }
            )
        }

        // Check if user already has 5 children (maximum limit)
        const existingChildrenCount = await prisma.child.count({
            where: { userId: session.user.id }
        })

        if (existingChildrenCount >= 5) {
            return NextResponse.json(
                { error: 'Maksimal 5 anak per akun' },
                { status: 400 }
            )
        }

        const { name, gender, birthDate, relationship } = validationResult.data

        // Create the child
        const child = await prisma.child.create({
            data: {
                name: name.trim(),
                gender,
                birthDate: new Date(birthDate),
                relationship: relationship.trim(),
                userId: session.user.id
            },
            select: {
                id: true,
                name: true,
                gender: true,
                birthDate: true,
                relationship: true,
                createdAt: true
            }
        })

        // Generate immunization schedule for the child
        await generateChildImmunizationRecords(child.id, child.birthDate)

        return NextResponse.json({
            child,
            message: 'Profil anak berhasil ditambahkan'
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating child:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}