'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { ToastDemo } from '@/components/notifications/ToastDemo'

export default function ToastDemoPage() {
    return (
        <AuthGuard>
            <AppLayout>
                <div className="max-w-4xl mx-auto">
                    <ToastDemo />
                </div>
            </AppLayout>
        </AuthGuard>
    )
}