'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { SyncStatus } from '@/components/offline/SyncStatus'
import { useDashboardData } from '@/hooks/useDashboardData'
import { usePerformanceMonitor } from '@/lib/performance-monitor'
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
    const { startTiming, endTiming, detectMemoryLeaks } = usePerformanceMonitor('Dashboard')

    // Monitor dashboard render performance
    useEffect(() => {
        if (status === 'authenticated') {
            startTiming('render')

            // Check for memory leaks periodically
            const memoryCheckInterval = setInterval(() => {
                if (typeof detectMemoryLeaks === 'function') {
                    detectMemoryLeaks()
                }
            }, 30000) // Check every 30 seconds

            return () => {
                endTiming('render')
                clearInterval(memoryCheckInterval)
            }
        }
    }, [status, startTiming, endTiming, detectMemoryLeaks])

    // Show loading state while session or data is loading
    if (status === 'loading' || isLoading) {
        return (
            <AppLayout>
                <div className="space-y-8">
                    {/* Loading skeleton with better design */}
                    <div className="p-6 bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 rounded-2xl">
                        <div className="animate-pulse flex items-center gap-4">
                            <div className="w-16 h-16 bg-orange-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-6 bg-orange-200 rounded w-2/3 mb-2"></div>
                                <div className="h-4 bg-orange-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={`loading-${i}`} className="bg-white rounded-2xl p-6 shadow-xl border border-orange-100">
                                <div className="animate-pulse flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                                    <div className="flex-1">
                                        <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
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
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto mt-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                            Muat Ulang Data
                        </button>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
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
                <LazyWrapper fallback={<CardLoadingSkeleton />}>
                    <DashboardStats onChildrenCountUpdate={setChildrenCount} />
                </LazyWrapper>

                {/* Child Overview - Only show if has children */}
                {hasChildren && (
                    <LazyWrapper fallback={<CardLoadingSkeleton />}>
                        <ChildOverview />
                    </LazyWrapper>
                )}

                {/* Quick Actions */}
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