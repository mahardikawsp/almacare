'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { SyncStatus } from '@/components/offline/SyncStatus'
import { useDashboardData } from '@/hooks/useDashboardData'
import { LazyWrapper, CardLoadingSkeleton } from '@/components/lazy/LazyWrapper'

// Lazy load heavy components
import { lazy } from 'react'
const DashboardStats = lazy(() => import('@/components/dashboard/DashboardStatsLazy'))
const ChildOverview = lazy(() => import('@/components/dashboard/ChildOverviewLazy'))
const QuickActions = lazy(() => import('@/components/dashboard/QuickActionsLazy'))
const RecentActivity = lazy(() => import('@/components/dashboard/RecentActivityLazy'))

function DashboardContent() {
    const { data: session, status } = useSession()
    const { isLoading, error, refreshData, hasChildren } = useDashboardData()
    const [childrenCount, setChildrenCount] = useState(0)

    // Show loading state while session or data is loading
    if (status === 'loading' || isLoading) {
        return (
            <AppLayout>
                <div className="space-y-8">
                    {/* Loading skeleton with modern design */}
                    <div className="p-6 bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 rounded-3xl shadow-lg">
                        <div className="animate-pulse flex items-center gap-4">
                            <div className="w-16 h-16 bg-orange-200 rounded-2xl"></div>
                            <div className="flex-1">
                                <div className="h-6 bg-orange-200 rounded-xl w-2/3 mb-2"></div>
                                <div className="h-4 bg-orange-200 rounded-lg w-1/2"></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={`loading-${i}`} className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                                <div className="animate-pulse flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                                    <div className="flex-1">
                                        <div className="h-6 bg-gray-200 rounded-xl w-16 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Memuat data dashboard...</p>
                    </div>
                </div>
            </AppLayout>
        )
    }

    if (error) {
        console.error('Dashboard error:', error)
        return (
            <AppLayout>
                <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-md mx-auto mt-8 shadow-lg">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Error icon">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-red-800 mb-3">
                        Terjadi Kesalahan
                    </h3>
                    <p className="text-red-600 mb-6 leading-relaxed">
                        Gagal memuat data dashboard. Silakan coba muat ulang atau refresh halaman.
                    </p>
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={refreshData}
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-semibold transition-colors"
                        >
                            Muat Ulang Data
                        </button>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-semibold transition-colors"
                        >
                            Refresh Halaman
                        </button>
                    </div>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50">
                <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
                    {/* Welcome Section - Updated Design */}
                    <div className="p-6 sm:p-8 bg-gradient-to-r from-orange-100 to-pink-100 border border-orange-200 rounded-3xl shadow-lg relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-20 rounded-full -translate-y-16 translate-x-16"></div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-800 mb-2 leading-tight">
                                    🌟 Your Wiz Kids
                                </h2>
                                <p className="text-base sm:text-lg text-orange-700 font-medium leading-relaxed">
                                    {hasChildren
                                        ? `Pantau tumbuh kembang ${childrenCount} anak Anda dengan mudah`
                                        : 'Mulai pantau tumbuh kembang anak Anda dengan mudah'
                                    }
                                </p>
                            </div>
                            {/* <div className="flex-shrink-0">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg">
                                    <span className="text-3xl sm:text-4xl">👶</span>
                                </div>
                            </div> */}
                        </div>
                    </div>

                    {/* Dashboard Stats - Updated Design */}
                    <LazyWrapper fallback={<CardLoadingSkeleton />}>
                        <DashboardStats onChildrenCountUpdate={setChildrenCount} />
                    </LazyWrapper>

                    {/* Child Overview - Only show if has children */}
                    {hasChildren && (
                        <LazyWrapper fallback={<CardLoadingSkeleton />}>
                            <ChildOverview />
                        </LazyWrapper>
                    )}

                    {/* Quick Actions - Updated Design */}
                    <LazyWrapper fallback={<CardLoadingSkeleton />}>
                        <QuickActions />
                    </LazyWrapper>

                    {/* Recent Activity - Only show if has children */}
                    {hasChildren && (
                        <LazyWrapper fallback={<CardLoadingSkeleton />}>
                            <RecentActivity />
                        </LazyWrapper>
                    )}
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