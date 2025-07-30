'use client'

import { useSession } from 'next-auth/react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'

function DashboardContent() {
    const { data: session } = useSession()

    return (
        <AppLayout>


            {/* Welcome Section */}
            <div className="mb-8 p-6 bg-primary-50 border border-primary-200 rounded-2xl shadow-soft">
                <h2 className="text-2xl font-bold text-primary-700 mb-2">
                    🌟 Selamat datang, {session?.user?.name}!
                </h2>
                <p className="text-primary-600 font-medium">
                    Pantau tumbuh kembang anak Anda dengan mudah
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200 hover:shadow-soft-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-primary-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-label="Child profile icon"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-neutral-900">0</p>
                            <p className="text-sm text-neutral-600 font-medium">Anak Terdaftar</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200 hover:shadow-soft-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary-100 rounded-2xl flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-secondary-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-label="Growth chart icon"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-neutral-900">0</p>
                            <p className="text-sm text-neutral-600 font-medium">Catatan Pertumbuhan</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200 hover:shadow-soft-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent-100 rounded-2xl flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-accent-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-label="Immunization shield icon"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-neutral-900">0</p>
                            <p className="text-sm text-neutral-600 font-medium">Imunisasi Selesai</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Getting Started */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    Mulai Memantau Anak Anda
                </h3>
                <p className="text-neutral-600 mb-6 font-medium">
                    Untuk memulai, tambahkan profil anak Anda terlebih dahulu.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        type="button"
                        onClick={() => window.location.href = '/children/add'}
                        className="p-4 border-2 border-dashed border-primary-300 rounded-2xl hover:border-primary-400 hover:bg-primary-50 transition-all duration-300 text-center group"
                    >
                        <div className="w-8 h-8 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:bg-primary-200 transition-colors">
                            <svg
                                className="w-4 h-4 text-primary-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-label="Add icon"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <p className="text-sm font-semibold text-primary-700">Tambah Anak</p>
                    </button>

                    <div className="p-4 border border-neutral-200 rounded-2xl opacity-50">
                        <div className="w-8 h-8 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                            <svg
                                className="w-4 h-4 text-neutral-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-label="Growth chart icon"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-neutral-400">Catat Pertumbuhan</p>
                    </div>

                    <div className="p-4 border border-neutral-200 rounded-2xl opacity-50">
                        <div className="w-8 h-8 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                            <svg
                                className="w-4 h-4 text-neutral-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-label="Immunization shield icon"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-neutral-400">Jadwal Imunisasi</p>
                    </div>

                    <div className="p-4 border border-neutral-200 rounded-2xl opacity-50">
                        <div className="w-8 h-8 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                            <svg
                                className="w-4 h-4 text-neutral-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-label="MPASI food icon"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-neutral-400">Menu MPASI</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default function DashboardPage() {
    return (
        <AuthGuard>
            <DashboardContent />
        </AuthGuard>
    )
}