'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { HomeIcon } from '../icons/HomeIcon'
import { GrowthIcon } from '../icons/GrowthIcon'
import { ImmunizationIcon } from '../icons/ImmunizationIcon'
import { MPASIIcon } from '../icons/MPASIIcon'

const navigationItems = [
    {
        name: 'Beranda',
        href: '/dashboard',
        icon: HomeIcon,
        activePattern: /^\/dashboard$/,
        color: 'from-primary-500 to-primary-600'
    },
    {
        name: 'Pertumbuhan',
        href: '/growth',
        icon: GrowthIcon,
        activePattern: /^\/growth/,
        color: 'from-accent-500 to-accent-600'
    },
    {
        name: 'Imunisasi',
        href: '/immunization',
        icon: ImmunizationIcon,
        activePattern: /^\/immunization/,
        color: 'from-blue-500 to-blue-600'
    },
    {
        name: 'MPASI',
        href: '/mpasi',
        icon: MPASIIcon,
        activePattern: /^\/mpasi/,
        color: 'from-secondary-500 to-secondary-600'
    }
]

export function BottomNavigation() {
    const pathname = usePathname()

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-pink-100/90 via-white/95 to-blue-100/90 backdrop-blur-lg border-t border-pink-200/50 z-30 shadow-large">
            <div className="grid grid-cols-4 px-2 py-1">
                {navigationItems.map((item) => {
                    const isActive = pathname ? item.activePattern.test(pathname) : false
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-2xl transition-all duration-300 ${isActive
                                ? 'text-white transform scale-105'
                                : 'text-purple-600 hover:text-pink-700 hover:bg-gradient-to-br hover:from-pink-50/60 hover:to-purple-50/60 hover:scale-105'
                                }`}
                        >
                            {/* Active background gradient */}
                            {isActive && (
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl shadow-medium`} />
                            )}

                            {/* Icon and text */}
                            <div className="relative z-10 flex flex-col items-center">
                                <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive
                                    ? 'bg-white/20 backdrop-blur-sm'
                                    : 'group-hover:bg-gradient-to-br group-hover:from-pink-50/60 group-hover:to-purple-50/60'
                                    }`}>
                                    <Icon
                                        className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-white' : 'text-purple-600'
                                            }`}
                                    />
                                </div>
                                <span className={`text-xs font-medium mt-1 transition-all duration-300 ${isActive ? 'text-white' : 'text-purple-600'
                                    }`}>
                                    {item.name}
                                </span>
                            </div>

                            {/* Active indicator dot */}
                            {isActive && (
                                <div className="absolute -top-1 w-1 h-1 bg-white rounded-full shadow-sm" />
                            )}
                        </Link>
                    )
                })}
            </div>

            {/* Safe area for devices with home indicator */}
            <div className="h-safe-area-inset-bottom bg-gradient-to-r from-pink-100/90 via-white/95 to-blue-100/90" />
        </nav>
    )
}