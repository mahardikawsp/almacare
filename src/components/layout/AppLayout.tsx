'use client'

import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { Header } from './Header'
import { BottomNavigation } from './BottomNavigation'
import { Sidebar } from './Sidebar'
import { ToastContainer } from '../notifications/ToastContainer'

interface AppLayoutProps {
    children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
    const { data: session } = useSession()

    if (!session) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-background-primary">

            {/* Header - Always visible */}
            <Header />

            <div className="flex relative z-10">
                {/* Sidebar - Hidden on mobile, visible on desktop/tablet */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 pb-20 md:pb-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="bg-white shadow-soft border border-neutral-200 rounded-2xl p-6 md:p-8">


                            <div className="relative z-10">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Bottom Navigation - Only visible on mobile */}
            <BottomNavigation />

            {/* Notification Components */}
            <ToastContainer />
        </div>
    )
}