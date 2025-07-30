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
        if (status === 'loading') return // Still loading

        if (!session) {
            router.push(redirectTo)
        }
    }, [session, status, router, redirectTo])

    // Show loading state
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-neutral-600">Memuat...</p>
                </div>
            </div>
        )
    }

    // Show fallback if not authenticated
    if (!session) {
        return fallback || (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-800 mb-2">
                        Akses Terbatas
                    </h2>
                    <p className="text-neutral-600 mb-4">
                        Anda perlu masuk untuk mengakses halaman ini
                    </p>
                    <button
                        onClick={() => router.push(redirectTo)}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
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