import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
    params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const { searchParams } = new URL(request.url)
        const childId = searchParams.get('childId')

        // Get recipe with favorites if childId is provided
        const recipe = await prisma.mPASIRecipe.findUnique({
            where: { id },
            include: childId ? {
                favorites: {
                    where: { childId },
                    select: { id: true }
                }
            } : undefined
        })

        if (!recipe) {
            return NextResponse.json(
                { success: false, error: 'Recipe not found' },
                { status: 404 }
            )
        }

        // Transform recipe to include isFavorite flag
        const recipeWithFavorite = {
            ...recipe,
            isFavorite: childId ? ('favorites' in recipe && Array.isArray(recipe.favorites) ? recipe.favorites.length > 0 : false) : false,
            favorites: undefined // Remove favorites from response
        }

        return NextResponse.json({
            success: true,
            data: recipeWithFavorite
        })
    } catch (error) {
        console.error('Error fetching MPASI recipe:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch recipe' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const { name, ageRangeMin, ageRangeMax, texture, ingredients, instructions, nutrition, imageUrl } = body

        const recipe = await prisma.mPASIRecipe.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(ageRangeMin && { ageRangeMin: parseInt(ageRangeMin) }),
                ...(ageRangeMax && { ageRangeMax: parseInt(ageRangeMax) }),
                ...(texture && { texture }),
                ...(ingredients && { ingredients }),
                ...(instructions && { instructions }),
                ...(nutrition && { nutrition }),
                ...(imageUrl !== undefined && { imageUrl })
            }
        })

        return NextResponse.json({
            success: true,
            data: recipe
        })
    } catch (error) {
        console.error('Error updating MPASI recipe:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update recipe' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        await prisma.mPASIRecipe.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'Recipe deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting MPASI recipe:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete recipe' },
            { status: 500 }
        )
    }
}