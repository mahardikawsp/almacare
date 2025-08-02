'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { ChildForm } from '@/components/children/ChildForm'
import { useRouter } from 'next/navigation'

function AddChildContent() {
    const router = useRouter()

    return (
        <AppLayout>
            <div className="w-full max-w-none lg:max-w-4xl xl:max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6 lg:mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-berkeley-blue hover:text-picton-blue mb-4 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg p-2 -ml-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </button>

                    <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-2">
                        Tambah Anak Baru
                    </h1>
                    <p className="text-neutral-600 font-medium">
                        Lengkapi informasi anak Anda untuk mulai memantau tumbuh kembang mereka.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-soft border border-neutral-200">
                    <div className="max-w-3xl mx-auto">
                        <ChildForm
                            mode="create"
                            onSuccess={() => router.push('/dashboard')}
                            onCancel={() => router.back()}
                        />
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