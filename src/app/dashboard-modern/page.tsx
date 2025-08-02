'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { ModernDashboard } from '@/components/dashboard/ModernDashboard'

export default function ModernDashboardPage() {
    return (
        <AuthGuard>
            <AppLayout>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                    <div className="container mx-auto px-4 py-6">
                        <ModernDashboard />
                    </div>
                </div>
            </AppLayout>
        </AuthGuard>
    )
}