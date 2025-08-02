'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { ChildForm } from '@/components/children/ChildForm'
import { useRouter } from 'next/navigation'

function AddChildContent() {
    const router = useRouter()

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50">
                <div className="w-full max-w-none lg:max-w-4xl xl:max-w-5xl mx-auto p-4 sm:p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-3 text-orange-700 hover:text-orange-800 mb-6 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-2xl p-3 bg-white shadow-sm hover:shadow-md"
                        >
                            <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                            Kembali
                        </button>

                        {/* Welcome Card */}
                        <div className="bg-gradient-to-r from-orange-100 to-pink-100 border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden mb-8">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-20 rounded-full -translate-y-16 translate-x-16"></div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-orange-800 mb-2 leading-tight">
                                        Tambah Anak Baru
                                    </h1>
                                    <p className="text-base sm:text-lg text-orange-700 font-medium leading-relaxed">
                                        Lengkapi informasi anak Anda untuk mulai memantau tumbuh kembang mereka dengan mudah.
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg">
                                        <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg border border-gray-100 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-50 to-pink-50 rounded-full -translate-y-20 translate-x-20 opacity-50"></div>

                        <div className="max-w-3xl mx-auto relative z-10">
                            <ChildForm
                                mode="create"
                                onSuccess={() => router.push('/dashboard')}
                                onCancel={() => router.back()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default function AddChildPage() {
    return (
        <AuthGuard>
            <AddChildContent />
        </AuthGuard>
    )
}