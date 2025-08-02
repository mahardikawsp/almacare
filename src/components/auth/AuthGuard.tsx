'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

interface AuthGuardProps {
    children: ReactNode
    fallback?: ReactNode
    redirectTo?: string
}

export function AuthGuard({
    children,
    fallback,
    redirectTo = '/auth/signin'
}: AuthGuardProps) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        // Only redirect if we're sure the user is not authenticated
        if (status === 'unauthenticated') {
            console.log('AuthGuard: Redirecting unauthenticated user to', redirectTo)
            router.push(redirectTo)
        }
    }, [status, router, redirectTo])

    // Show loading state while checking authentication
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Memuat...</p>
                </div>
            </div>
        )
    }

    // Show fallback if not authenticated (but don't redirect immediately)
    if (status === 'unauthenticated' || !session) {
        return fallback || (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        Akses Terbatas
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Anda perlu masuk untuk mengakses halaman ini. Silakan login terlebih dahulu.
                    </p>
                    <button
                        onClick={() => router.push(redirectTo)}
                        className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        Masuk Sekarang
                    </button>
                </div>
            </div>
        )
    }

    // Render children if authenticated
    return <>{children}</>
}

// Higher-order component version
export function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    options?: {
        fallback?: ReactNode
        redirectTo?: string
    }
) {
    return function AuthenticatedComponent(props: P) {
        return (
            <AuthGuard
                fallback={options?.fallback}
                redirectTo={options?.redirectTo}
            >
                <Component {...props} />
            </AuthGuard>
        )
    }
}