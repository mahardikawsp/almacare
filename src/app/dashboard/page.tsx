'use client'

import { useSession } from 'next-auth/react'
import { useState, Suspense, useEffect } from 'react'
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
    const { data: session } = useSession()
    const { isLoading, error, refreshData, hasChildren } = useDashboardData()
    const [childrenCount, setChildrenCount] = useState(0)
    const { startTiming, endTiming, detectMemoryLeaks } = usePerformanceMonitor('Dashboard')

    // Monitor dashboard render performance
    useEffect(() => {
        startTiming('render')

        // Check for memory leaks periodically
        const memoryCheckInterval = setInterval(() => {
            if (typeof detectMemoryLeaks === 'function') {
                detectMemoryLeaks()
            }
        }, 10000) // Check every 10 seconds instead of using setTimeout

        return () => {
            endTiming('render')
            clearInterval(memoryCheckInterval)
        }
    }, [])

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