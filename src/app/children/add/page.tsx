'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { ChildForm } from '@/components/children/ChildForm'
import { useRouter } from 'next/navigation'

function AddChildContent() {
    const router = useRouter()

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </button>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Tambah Anak Baru
                    </h1>
                    <p className="text-gray-600">
                        Lengkapi informasi anak Anda untuk mulai memantau tumbuh kembang mereka.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg p-6 shadow border border-gray-200">
                    <ChildForm
                        mode="create"
                        onSuccess={() => router.push('/dashboard')}
                        onCancel={() => router.back()}
                    />
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