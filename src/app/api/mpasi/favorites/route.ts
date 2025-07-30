import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const childId = searchParams.get('childId')

        if (!childId) {
            return NextResponse.json(
                { success: false, error: 'Child ID is required' },
                { status: 400 }
            )
        }

        // Verify child belongs to user
        const child = await prisma.child.findFirst({
            where: {
                id: childId,
                userId: session.user.id
            }
        })

        if (!child) {
            return NextResponse.json(
                { success: false, error: 'Child not found' },
                { status: 404 }
            )
        }

        const favorites = await prisma.mPASIFavorite.findMany({
            where: { childId },
            include: {
                recipe: true
            },
            orderBy: { createdAt: 'desc' }
        })

        const favoriteRecipes = favorites.map(favorite => ({
            ...favorite.recipe,
            isFavorite: true
        }))

        return NextResponse.json({
            success: true,
            data: favoriteRecipes
        })
    } catch (error) {
        console.error('Error fetching favorite recipes:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch favorites' },
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
        const { childId, recipeId } = body

        if (!childId || !recipeId) {
            return NextResponse.json(
                { success: false, error: 'Child ID and Recipe ID are required' },
                { status: 400 }
            )
        }

        // Verify child belongs to user
        const child = await prisma.child.findFirst({
            where: {
                id: childId,
                userId: session.user.id
            }
        })

        if (!child) {
            return NextResponse.json(
                { success: false, error: 'Child not found' },
                { status: 404 }
            )
        }

        // Verify recipe exists
        const recipe = await prisma.mPASIRecipe.findUnique({
            where: { id: recipeId }
        })

        if (!recipe) {
            return NextResponse.json(
                { success: false, error: 'Recipe not found' },
                { status: 404 }
            )
        }

        // Create favorite (upsert to handle duplicates)
        const favorite = await prisma.mPASIFavorite.upsert({
            where: {
                childId_recipeId: {
                    childId,
                    recipeId
                }
            },
            update: {},
            create: {
                childId,
                recipeId
            }
        })

        return NextResponse.json({
            success: true,
            data: favorite,
            message: 'Recipe added to favorites'
        })
    } catch (error) {
        console.error('Error adding recipe to favorites:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to add to favorites' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const childId = searchParams.get('childId')
        const recipeId = searchParams.get('recipeId')

        if (!childId || !recipeId) {
            return NextResponse.json(
                { success: false, error: 'Child ID and Recipe ID are required' },
                { status: 400 }
            )
        }

        // Verify child belongs to user
        const child = await prisma.child.findFirst({
            where: {
                id: childId,
                userId: session.user.id
            }
        })

        if (!child) {
            return NextResponse.json(
                { success: false, error: 'Child not found' },
                { status: 404 }
            )
        }

        await prisma.mPASIFavorite.delete({
            where: {
                childId_recipeId: {
                    childId,
                    recipeId
                }
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Recipe removed from favorites'
        })
    } catch (error) {
        console.error('Error removing recipe from favorites:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to remove from favorites' },
            { status: 500 }
        )
    }
}