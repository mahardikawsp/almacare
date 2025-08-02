import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(request: NextRequest) {
    try {
        // Read the service worker file from public directory
        const swPath = join(process.cwd(), 'public', 'sw.js')
        const swContent = readFileSync(swPath, 'utf8')

        return new NextResponse(swContent, {
            status: 200,
            headers: {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'public, max-age=0, must-revalidate',
                'Service-Worker-Allowed': '/'
            }
        })
    } catch (error) {
        console.error('Error serving service worker:', error)
        return new NextResponse('Service worker not found', { status: 404 })
    }
}