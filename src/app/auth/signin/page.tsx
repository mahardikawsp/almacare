'use client'

import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function SignInPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Check if user is already signed in
        getSession().then((session) => {
            if (session) {
                router.push('/dashboard')
            }
        })
    }, [router])

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const result = await signIn('google', {
                callbackUrl: '/dashboard',
                redirect: false
            })

            if (result?.error) {
                setError('Terjadi kesalahan saat masuk. Silakan coba lagi.')
            } else if (result?.url) {
                router.push(result.url)
            }
        } catch (err) {
            setError('Terjadi kesalahan saat masuk. Silakan coba lagi.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-soft p-8">
                    {/* Logo and Title */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-neutral-800 mb-2">
                            Selamat Datang di BayiCare
                        </h1>
                        <p className="text-neutral-600">
                            Masuk untuk memantau tumbuh kembang anak Anda
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Google Sign In Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-neutral-200 rounded-xl px-6 py-4 text-neutral-700 font-medium hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        <span>
                            {isLoading ? 'Sedang masuk...' : 'Masuk dengan Google'}
                        </span>
                    </button>

                    {/* Features Preview */}
                    <div className="mt-8 pt-6 border-t border-neutral-200">
                        <p className="text-sm text-neutral-500 text-center mb-4">
                            Dengan BayiCare, Anda dapat:
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-sm text-neutral-600">
                                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                <span>Memantau pertumbuhan dengan standar WHO</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-600">
                                <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                                <span>Mengikuti jadwal imunisasi nasional</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-600">
                                <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                                <span>Mendapatkan rekomendasi menu MPASI</span>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Notice */}
                    <div className="mt-6 pt-4 border-t border-neutral-100">
                        <p className="text-xs text-neutral-400 text-center">
                            Dengan masuk, Anda menyetujui bahwa data anak akan disimpan dengan aman dan hanya digunakan untuk keperluan pemantauan kesehatan.
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => router.push('/')}
                        className="text-neutral-500 hover:text-neutral-700 text-sm transition-colors"
                    >
                        ← Kembali ke beranda
                    </button>
                </div>
            </div>
        </div>
    )
}