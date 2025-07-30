import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl
        const token = req.nextauth.token

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

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl

                // Allow access to public routes
                if (pathname === '/' ||
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