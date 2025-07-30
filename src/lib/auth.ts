import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'

// Dynamic base URL configuration for cloud deployment
function getBaseUrl(): string {
    // In production, use NEXTAUTH_URL if set, otherwise detect from headers
    if (process.env.NEXTAUTH_URL) {
        return process.env.NEXTAUTH_URL
    }

    // For Vercel deployments
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`
    }

    // For other cloud providers, try to detect from common environment variables
    if (process.env.RAILWAY_STATIC_URL) {
        return `https://${process.env.RAILWAY_STATIC_URL}`
    }

    if (process.env.RENDER_EXTERNAL_URL) {
        return process.env.RENDER_EXTERNAL_URL
    }

    // Default to localhost for development
    return process.env.NODE_ENV === 'production'
        ? 'https://your-production-domain.com'
        : 'http://localhost:3000'
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.uid = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session?.user && token.sub) {
                session.user.id = token.sub
            }
            return session
        },
        async redirect({ url, baseUrl }) {
            const correctBaseUrl = getBaseUrl()

            console.log('NextAuth redirect:', { url, baseUrl, correctBaseUrl })

            // Fix any localhost URLs in the incoming URL
            let fixedUrl = url
            if (url.includes('localhost:3000')) {
                fixedUrl = url.replace(/https?:\/\/localhost:3000/g, correctBaseUrl)
                console.log('Fixed localhost URL:', url, '->', fixedUrl)
            }

            // If url is relative, make it absolute with correct domain
            if (fixedUrl.startsWith('/')) {
                const redirectUrl = `${correctBaseUrl}${fixedUrl}`
                console.log('Redirecting to:', redirectUrl)
                return redirectUrl
            }

            // If url is absolute and matches our domain, allow it
            if (fixedUrl.startsWith(correctBaseUrl)) {
                console.log('Allowing redirect to:', fixedUrl)
                return fixedUrl
            }

            // For external URLs or localhost, redirect to dashboard
            const dashboardUrl = `${correctBaseUrl}/dashboard`
            console.log('External/localhost URL, redirecting to dashboard:', dashboardUrl)
            return dashboardUrl
        },
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    debug: process.env.NODE_ENV === 'development',
    secret: process.env.NEXTAUTH_SECRET,
}