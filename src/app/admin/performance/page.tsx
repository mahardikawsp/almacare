'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { PerformanceMonitorComponent } from '@/components/admin/PerformanceMonitor'

export default function PerformancePage() {
    return (
        <AuthGuard>
            <AppLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Performance Monitor</h1>
                        <p className="mt-2 text-gray-600">
                            Monitor aplikasi performance, memory usage, dan database metrics
                        </p>
                    </div>

                    <PerformanceMonitorComponent />
                </div>
            </AppLayout>
        </AuthGuard>
    )
}