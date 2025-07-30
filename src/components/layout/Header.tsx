'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UserProfile } from '../auth/UserProfile'
import { ChildSwitcher } from './ChildSwitcher'
import { BellNotifications } from '../notifications/BellNotifications'

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-label="BayiCare Logo"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-blue-600 hidden sm:block">
                                BayiCare
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
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                            aria-label="Toggle mobile menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
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
                    <div className="md:hidden border-t border-neutral-200 py-4">
                        <div className="space-y-4">
                            {/* Child Switcher for Mobile */}
                            <div className="px-2">
                                <ChildSwitcher />
                            </div>

                            {/* User Profile for Mobile */}
                            <div className="px-2">
                                <UserProfile />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}