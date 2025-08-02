'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { UserProfile } from '../auth/UserProfile'
import { ChildSwitcher } from './ChildSwitcher'
import { BellNotifications } from '../notifications/BellNotifications'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { aria } from '@/lib/accessibility'

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <header
            className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-soft"
            {...aria.role('banner')}
        >
            {/* Skip to main content link */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
                Skip to main content
            </a>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg p-1"
                            {...aria.label('AlmaCare - Kembali ke beranda')}
                        >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-white shadow-soft border border-neutral-200">
                                <img
                                    src="/icon.png"
                                    alt="AlmaCare Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <h1 className="text-xl font-bold text-primary-600 hidden sm:block">
                                AlmaCare
                            </h1>
                        </Link>

                        {/* Child Switcher - Hidden on mobile, shown in sidebar */}
                        <div className="hidden md:block">
                            <ChildSwitcher />
                        </div>
                    </div>

                    {/* Right side - Notifications and User Profile */}
                    <div className="flex items-center gap-4">
                        {/* Bell Notification */}
                        <BellNotifications />

                        {/* Mobile Menu Sheet with enhanced shadcn/ui styling */}
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden hover:bg-accent/50 transition-colors"
                                    aria-label="Buka menu mobile"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[320px] sm:w-[380px] bg-card/95 backdrop-blur-md">
                                <SheetHeader className="border-b border-border pb-4">
                                    <SheetTitle className="text-lg font-semibold text-foreground">
                                        Menu Aplikasi
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="mt-6 space-y-8">
                                    {/* Child Switcher for Mobile */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                            Pilih Anak
                                        </h3>
                                        <div className="p-3 bg-accent/20 rounded-lg border border-border/50">
                                            <ChildSwitcher />
                                        </div>
                                    </div>

                                    {/* User Profile for Mobile */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                            Profil Pengguna
                                        </h3>
                                        <div className="p-3 bg-accent/20 rounded-lg border border-border/50">
                                            <UserProfile />
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* User Profile - Hidden on mobile */}
                        <div className="hidden md:block">
                            <UserProfile />
                        </div>
                    </div>
                </div>


            </div>
        </header>
    )
}