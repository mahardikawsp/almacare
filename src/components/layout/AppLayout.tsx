'use client'

import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { Header } from './Header'
import { BottomNavigation } from './BottomNavigation'
import { Sidebar } from './Sidebar'
import { ToastContainer } from '../notifications/ToastContainer'
import { aria } from '@/lib/accessibility'

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

            <div className="flex relative z-10 w-full">
                {/* Sidebar - Hidden on mobile, visible on desktop/tablet */}
                <Sidebar />

                {/* Main Content */}
                <main
                    id="main-content"
                    className="flex-1 pb-20 md:pb-6 min-h-screen w-full min-w-0"
                    {...aria.role('main')}
                    {...aria.label('Konten utama aplikasi')}
                >
                    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 md:py-6">
                        <div className="bg-white shadow-soft border border-neutral-200 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-8rem)] w-full overflow-hidden">
                            <div className="relative z-10 w-full">
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