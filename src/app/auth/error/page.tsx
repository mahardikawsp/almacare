'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const error = searchParams?.get('error') || null

    const getErrorMessage = (error: string | null) => {
        switch (error) {
            case 'Configuration':
                return 'Terjadi kesalahan konfigurasi. Silakan hubungi administrator.'
            case 'AccessDenied':
                return 'Akses ditolak. Anda tidak memiliki izin untuk masuk.'
            case 'Verification':
                return 'Token verifikasi tidak valid atau sudah kedaluwarsa.'
            case 'OAuthSignin':
                return 'Terjadi kesalahan saat masuk dengan Google. Silakan coba lagi.'
            case 'OAuthCallback':
                return 'Terjadi kesalahan saat memproses callback dari Google.'
            case 'OAuthCreateAccount':
                return 'Tidak dapat membuat akun. Silakan coba lagi.'
            case 'EmailCreateAccount':
                return 'Tidak dapat membuat akun dengan email tersebut.'
            case 'Callback':
                return 'Terjadi kesalahan saat callback. Silakan coba lagi.'
            case 'OAuthAccountNotLinked':
                return 'Email sudah terdaftar dengan metode login lain.'
            case 'EmailSignin':
                return 'Tidak dapat mengirim email verifikasi.'
            case 'CredentialsSignin':
                return 'Kredensial tidak valid. Periksa email dan password Anda.'
            case 'SessionRequired':
                return 'Anda harus masuk untuk mengakses halaman ini.'
            default:
                return 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-soft p-8">
                    {/* Error Icon */}
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-neutral-800 mb-2">
                            Terjadi Kesalahan
                        </h1>
                        <p className="text-neutral-600">
                            {getErrorMessage(error)}
                        </p>
                    </div>

                    {/* Error Details */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">
                                <span className="font-medium">Kode Error:</span> {error}
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/auth/signin')}
                            className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                        >
                            Coba Masuk Lagi
                        </button>

                        <button
                            onClick={() => router.push('/')}
                            className="w-full bg-neutral-100 text-neutral-700 py-3 px-4 rounded-xl font-medium hover:bg-neutral-200 transition-colors"
                        >
                            Kembali ke Beranda
                        </button>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 pt-4 border-t border-neutral-200">
                        <p className="text-sm text-neutral-500 text-center">
                            Jika masalah terus berlanjut, silakan hubungi tim dukungan kami.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
            </div>
        }>
            <ErrorContent />
        </Suspense>
    )
}