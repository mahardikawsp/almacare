import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Performance monitoring middleware
function addPerformanceHeaders(response: NextResponse) {
    // Add performance and security headers
    response.headers.set('X-DNS-Prefetch-Control', 'on')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

    // Add cache control for static assets
    if (response.url.includes('/_next/static/') ||
        response.url.includes('/icons/') ||
        response.url.includes('/manifest.json')) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    }

    // Add performance timing header
    response.headers.set('X-Response-Time', Date.now().toString())

    return response
}

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl
        const token = req.nextauth.token

        // Handle service worker requests
        if (pathname === '/sw.js') {
            const response = NextResponse.next()
            response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
            response.headers.set('Service-Worker-Allowed', '/')
            response.headers.set('Content-Type', 'application/javascript')
            return response
        }

        // Allow access to auth pages when not authenticated
        if (pathname.startsWith('/auth/') && !token) {
            return NextResponse.next()
        }

        // Redirect authenticated users away from auth pages
        if (pathname.startsWith('/auth/') && token) {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }

        // Protect dashboard and other protected routes
        if (pathname.startsWith('/dashboard') && !token) {
            return NextResponse.redirect(new URL('/auth/signin', req.url))
        }

        if (pathname.startsWith('/children') && !token) {
            return NextResponse.redirect(new URL('/auth/signin', req.url))
        }

        if (pathname.startsWith('/growth') && !token) {
            return NextResponse.redirect(new URL('/auth/signin', req.url))
        }

        if (pathname.startsWith('/immunization') && !token) {
            return NextResponse.redirect(new URL('/auth/signin', req.url))
        }

        if (pathname.startsWith('/mpasi') && !token) {
            return NextResponse.redirect(new URL('/auth/signin', req.url))
        }

        const response = NextResponse.next()
        return addPerformanceHeaders(response)
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl

                // Allow access to public routes
                if (pathname === '/' ||
                    pathname === '/sw.js' ||
                    pathname.startsWith('/api/auth') ||
                    pathname.startsWith('/offline') ||
                    pathname.startsWith('/_next') ||
                    pathname.startsWith('/favicon') ||
                    pathname.startsWith('/icons') ||
                    pathname.startsWith('/manifest')) {
                    return true
                }

                // Allow access to auth pages regardless of token
                if (pathname.startsWith('/auth/')) {
                    return true
                }

                // Require authentication for protected routes
                if (pathname.startsWith('/dashboard') ||
                    pathname.startsWith('/children') ||
                    pathname.startsWith('/growth') ||
                    pathname.startsWith('/immunization') ||
                    pathname.startsWith('/mpasi')) {
                    return !!token
                }

                return true
            },
        },
    }
)

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (NextAuth.js API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|workbox-.*\\.js).*)',
    ],
}