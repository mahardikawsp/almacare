'use client'

import { useSession } from 'next-auth/react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { ChildOverview } from '@/components/dashboard/ChildOverview'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { SyncStatus } from '@/components/offline/SyncStatus'
import { useDashboardData } from '@/hooks/useDashboardData'
import { Button } from '@/components/ui/button'
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
                    <Button
                        onClick={refreshData}
                        variant="default"
                        size="default"
                    >
                        Muat Ulang
                    </Button>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="space-y-6 sm:space-y-8">
                {/* Welcome Section */}
                <div className="p-4 sm:p-6 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl sm:rounded-2xl shadow-soft">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-700 mb-2 leading-tight">
                                🌟 Selamat datang, {session?.user?.name}!
                            </h2>
                            <p className="text-sm sm:text-base text-primary-600 font-medium leading-relaxed">
                                {hasChildren
                                    ? `Pantau tumbuh kembang ${childrenCount} anak Anda dengan mudah`
                                    : 'Mulai pantau tumbuh kembang anak Anda dengan mudah'
                                }
                            </p>
                            {/* Sync Status */}
                            <div className="mt-2">
                                <SyncStatus className="text-primary-600" />
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-soft">
                                <span className="text-2xl sm:text-3xl">👶</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <DashboardStats onChildrenCountUpdate={setChildrenCount} />

                {/* Child Overview - Only show if has children */}
                {hasChildren && <ChildOverview />}

                {/* Quick Actions */}
                <QuickActions />

                {/* Recent Activity - Only show if has children */}
                {/* {hasChildren && <RecentActivity />} */}
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