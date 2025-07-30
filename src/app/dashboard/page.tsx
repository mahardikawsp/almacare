'use client'

import { useSession } from 'next-auth/react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { ChildOverview } from '@/components/dashboard/ChildOverview'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useState } from 'react'

function DashboardContent() {
    const { data: session } = useSession()
    const { isLoading, error, refreshData, hasChildren } = useDashboardData()
    const [childrenCount, setChildrenCount] = useState(0)

    if (isLoading) {
        return (
            <AppLayout>
                <div className="space-y-8">
                    {/* Loading skeleton */}
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200">
                                <div className="animate-pulse flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                                    <div>
                                        <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AppLayout>
        )
    }

    if (error) {
        return (
            <AppLayout>
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                        Terjadi Kesalahan
                    </h3>
                    <p className="text-red-600 mb-4">
                        Gagal memuat data dashboard. Silakan coba lagi.
                    </p>
                    <button
                        onClick={refreshData}
                        className="btn btn-primary"
                    >
                        Muat Ulang
                    </button>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            {/* Welcome Section */}
            <div className="mb-8 p-6 bg-primary-50 border border-primary-200 rounded-2xl shadow-soft">
                <h2 className="text-2xl font-bold text-primary-700 mb-2">
                    🌟 Selamat datang, {session?.user?.name}!
                </h2>
                <p className="text-primary-600 font-medium">
                    {hasChildren
                        ? `Pantau tumbuh kembang ${childrenCount} anak Anda dengan mudah`
                        : 'Mulai pantau tumbuh kembang anak Anda dengan mudah'
                    }
                </p>
            </div>

            {/* Dashboard Stats */}
            <DashboardStats onChildrenCountUpdate={setChildrenCount} />

            {/* Child Overview - Only show if has children */}
            {hasChildren && <ChildOverview />}

            {/* Quick Actions */}
            <div className="mb-8">
                <QuickActions />
            </div>

            {/* Recent Activity - Only show if has children */}
            {hasChildren && <RecentActivity />}
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