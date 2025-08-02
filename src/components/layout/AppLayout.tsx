'use client'

import type { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { Header } from './Header'
import { BottomNavigation } from './BottomNavigation'
import { Sidebar } from './Sidebar'
import { ToastContainer } from '../notifications/ToastContainer'
import { cn } from '@/lib/utils'
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
        <div className={cn(
            "min-h-screen bg-background",
            // Safe area handling for all sides
            "pt-[max(0rem,env(safe-area-inset-top))]",
            "pb-[max(0rem,env(safe-area-inset-bottom))]",
            "pl-[max(0rem,env(safe-area-inset-left))]",
            "pr-[max(0rem,env(safe-area-inset-right))]"
        )}>
            {/* Header - Always visible */}
            <Header />

            <div className="flex relative z-10">
                {/* Sidebar - Hidden on mobile, visible on desktop/tablet */}
                <Sidebar />

                {/* Main Content with enhanced shadcn/ui styling */}
                <main
                    id="main-content"
                    className="flex-1 pb-20 lg:pb-6 min-h-screen"
                    {...aria.role('main')}
                    {...aria.label('Konten utama aplikasi')}
                >
                    <div className={cn(
                        "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8",
                        // Additional safe area padding for content
                        "px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]"
                    )}>
                        <div className={cn(
                            "bg-card shadow-lg border border-border rounded-xl lg:rounded-2xl",
                            "p-4 sm:p-6 md:p-8 min-h-[calc(100vh-8rem)]",
                            "backdrop-blur-sm"
                        )}>
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