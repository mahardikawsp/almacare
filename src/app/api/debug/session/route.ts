import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        return NextResponse.json({
            hasSession: !!session,
            hasUser: !!session?.user,
            hasUserId: !!session?.user?.id,
            userId: session?.user?.id,
            userEmail: session?.user?.email,
            sessionExpires: session?.expires,
            headers: Object.fromEntries(request.headers.entries()),
            cookies: request.cookies.getAll(),
            url: request.url
        })
    } catch (error) {
        console.error('Debug session error:', error)
        return NextResponse.json({
            error: 'Failed to get session',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}