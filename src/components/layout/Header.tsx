'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { UserProfile } from '../auth/UserProfile'
import { ChildSwitcher } from './ChildSwitcher'
import { BellNotifications } from '../notifications/BellNotifications'
import { aria, keyboard } from '@/lib/accessibility'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const mobileMenuRef = useRef<HTMLDivElement>(null)

    // Close mobile menu on escape key
    useKeyboardNavigation({
        onEscape: () => setIsMobileMenuOpen(false),
        enabled: isMobileMenuOpen
    })

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

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

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
                            {...aria.label(isMobileMenuOpen ? 'Tutup menu mobile' : 'Buka menu mobile')}
                            {...aria.expanded(isMobileMenuOpen)}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                {...aria.hidden(true)}
                            >
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>

                        {/* User Profile - Hidden on mobile */}
                        <div className="hidden md:block">
                            <UserProfile />
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div
                        ref={mobileMenuRef}
                        className="md:hidden border-t border-neutral-200 py-4 animate-slide-down"
                        {...aria.role('menu')}
                        {...aria.label('Menu mobile')}
                    >
                        <div className="space-y-4">
                            {/* Child Switcher for Mobile */}
                            <div className="px-2" {...aria.role('menuitem')}>
                                <ChildSwitcher />
                            </div>

                            {/* User Profile for Mobile */}
                            <div className="px-2" {...aria.role('menuitem')}>
                                <UserProfile />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}