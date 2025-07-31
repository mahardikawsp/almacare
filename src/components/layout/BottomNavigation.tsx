'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { HomeIcon } from '../icons/HomeIcon'
import { GrowthIcon } from '../icons/GrowthIcon'
import { ImmunizationIcon } from '../icons/ImmunizationIcon'
import { MPASIIcon } from '../icons/MPASIIcon'
import { aria } from '@/lib/accessibility'

const navigationItems = [
    {
        name: 'Beranda',
        href: '/dashboard',
        icon: HomeIcon,
        activePattern: /^\/dashboard$/,
        ariaLabel: 'Navigasi ke halaman beranda'
    },
    {
        name: 'Pertumbuhan',
        href: '/growth',
        icon: GrowthIcon,
        activePattern: /^\/growth/,
        ariaLabel: 'Navigasi ke halaman pertumbuhan anak'
    },
    {
        name: 'Imunisasi',
        href: '/immunization',
        icon: ImmunizationIcon,
        activePattern: /^\/immunization/,
        ariaLabel: 'Navigasi ke halaman jadwal imunisasi'
    },
    {
        name: 'MPASI',
        href: '/mpasi',
        icon: MPASIIcon,
        activePattern: /^\/mpasi/,
        ariaLabel: 'Navigasi ke halaman resep MPASI'
    }
]

export function BottomNavigation() {
    const pathname = usePathname()

    return (
        <nav
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-neutral-200 z-30 shadow-lg"
            {...aria.role('navigation')}
            {...aria.label('Navigasi utama aplikasi')}
        >
            <div className="grid grid-cols-4 px-1 sm:px-2 py-1">
                {navigationItems.map((item) => {
                    const isActive = pathname ? item.activePattern.test(pathname) : false
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center py-2 sm:py-3 px-1 sm:px-2 rounded-lg sm:rounded-xl transition-all duration-200 min-h-[56px] sm:min-h-[60px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${isActive
                                ? 'text-primary-600'
                                : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                                }`}
                            {...aria.label(item.ariaLabel)}
                            {...(isActive && aria.selected(true))}
                            tabIndex={0}
                        >
                            {/* Icon and text */}
                            <div className="flex flex-col items-center">
                                <div className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-primary-100'
                                    : 'hover:bg-primary-50'
                                    }`}>
                                    <Icon
                                        className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 ${isActive ? 'text-primary-600' : 'text-neutral-600'
                                            }`}
                                        {...aria.hidden(true)}
                                    />
                                </div>
                                <span className={`text-xs font-medium mt-1 transition-colors duration-200 truncate max-w-full ${isActive ? 'text-primary-600' : 'text-neutral-600'
                                    }`}>
                                    {item.name}
                                </span>
                            </div>

                            {/* Active indicator */}
                            {isActive && (
                                <div
                                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary-600 rounded-b-full"
                                    {...aria.hidden(true)}
                                />
                            )}

                            {/* Screen reader status */}
                            {isActive && (
                                <span className="sr-only">Halaman aktif</span>
                            )}
                        </Link>
                    )
                })}
            </div>

            {/* Safe area for devices with home indicator */}
            <div
                className="h-safe-bottom bg-white/95"
                {...aria.hidden(true)}
            />
        </nav>
    )
}