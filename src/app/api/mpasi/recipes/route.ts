import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Texture } from '@prisma/client'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const ageMin = searchParams.get('ageMin')
        const ageMax = searchParams.get('ageMax')
        const texture = searchParams.get('texture')
        const search = searchParams.get('search')
        const childId = searchParams.get('childId')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')

        const skip = (page - 1) * limit

        // Build where clause
        const where: Record<string, unknown> = {}

        if (ageMin && ageMax) {
            where.AND = [
                { ageRangeMin: { lte: parseInt(ageMax) } },
                { ageRangeMax: { gte: parseInt(ageMin) } }
            ]
        }

        if (texture && texture !== 'all') {
            where.texture = texture as Texture
        }

        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive'
            }
        }

        // Get recipes with favorites if childId is provided
        const recipes = await prisma.mPASIRecipe.findMany({
            where,
            include: childId ? {
                favorites: {
                    where: { childId },
                    select: { id: true }
                }
            } : undefined,
            skip,
            take: limit,
            orderBy: { name: 'asc' }
        })

        // Get total count for pagination
        const total = await prisma.mPASIRecipe.count({ where })

        // Transform recipes to include isFavorite flag
        const recipesWithFavorites = recipes.map(recipe => ({
            ...recipe,
            isFavorite: childId ? ('favorites' in recipe && Array.isArray(recipe.favorites) ? recipe.favorites.length > 0 : false) : false,
            favorites: undefined // Remove favorites from response
        }))

        return NextResponse.json({
            success: true,
            data: recipesWithFavorites,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching MPASI recipes:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch recipes' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { name, ageRangeMin, ageRangeMax, texture, ingredients, instructions, nutrition, imageUrl } = body

        // Validate required fields
        if (!name || !ageRangeMin || !ageRangeMax || !texture || !ingredients || !instructions || !nutrition) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const recipe = await prisma.mPASIRecipe.create({
            data: {
                name,
                ageRangeMin: parseInt(ageRangeMin),
                ageRangeMax: parseInt(ageRangeMax),
                texture: texture as Texture,
                ingredients,
                instructions,
                nutrition,
                imageUrl
            }
        })

        return NextResponse.json({
            success: true,
            data: recipe
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating MPASI recipe:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create recipe' },
            { status: 500 }
        )
    }
}