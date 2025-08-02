'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChildSwitcher } from './ChildSwitcher'
import { HomeIcon } from '../icons/HomeIcon'
import { GrowthIcon } from '../icons/GrowthIcon'
import { ImmunizationIcon } from '../icons/ImmunizationIcon'
import { MPASIIcon } from '../icons/MPASIIcon'
import { ChildIcon } from '../icons/ChildIcon'
import { ChartIcon } from '../icons/ChartIcon'

const navigationItems = [
    {
        name: 'Beranda',
        href: '/dashboard',
        icon: HomeIcon,
        activePattern: /^\/dashboard$/,
        description: 'Ringkasan dan aktivitas terbaru',
        color: 'from-picton-blue to-berkeley-blue'
    },
    {
        name: 'Kelola Anak',
        href: '/children',
        icon: ChildIcon,
        activePattern: /^\/children/,
        description: 'Tambah dan kelola profil anak',
        color: 'from-picton-blue to-berkeley-blue'
    },
    {
        name: 'Pertumbuhan',
        href: '/growth',
        icon: GrowthIcon,
        activePattern: /^\/growth/,
        description: 'Catat dan pantau pertumbuhan',
        color: 'from-picton-blue to-berkeley-blue'
    },
    {
        name: 'Imunisasi',
        href: '/immunization',
        icon: ImmunizationIcon,
        activePattern: /^\/immunization/,
        description: 'Jadwal dan riwayat imunisasi',
        color: 'from-picton-blue to-berkeley-blue'
    },
    {
        name: 'MPASI',
        href: '/mpasi',
        icon: MPASIIcon,
        activePattern: /^\/mpasi/,
        description: 'Resep dan menu makanan bayi',
        color: 'from-picton-blue to-berkeley-blue'
    },
    {
        name: 'Grafik & Laporan',
        href: '/reports',
        icon: ChartIcon,
        activePattern: /^\/reports/,
        description: 'Visualisasi data dan laporan',
        color: 'from-picton-blue to-berkeley-blue'
    }
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 bg-gradient-to-b from-alice-blue via-primary-50 to-secondary-50 border-r border-alice-blue min-h-screen shadow-soft-lg backdrop-blur-sm flex-shrink-0">
            <div className="flex-1 flex flex-col">
                {/* Child Switcher */}
                <div className="p-4 border-b border-alice-blue bg-gradient-to-r from-alice-blue to-primary-50">
                    <ChildSwitcher />
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-3">
                    {navigationItems.map((item) => {
                        const isActive = pathname ? item.activePattern.test(pathname) : false
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group overflow-hidden ${isActive
                                    ? 'text-white shadow-warm transform scale-[1.02]'
                                    : 'text-neutral-700 hover:bg-gradient-to-r hover:from-white/80 hover:to-primary-50/80 hover:shadow-soft hover:scale-[1.01]'
                                    }`}
                            >
                                {/* Active background gradient */}
                                {isActive && (
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl`} />
                                )}

                                {/* Hover background */}
                                {!isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-primary-100/50 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                )}

                                {/* Icon container */}
                                <div className={`relative z-10 p-2 rounded-xl transition-all duration-300 ${isActive
                                    ? 'bg-white/20 backdrop-blur-sm'
                                    : 'bg-gradient-to-br from-white/80 to-primary-100/60 group-hover:from-white/95 group-hover:to-primary-100/80'
                                    }`}>
                                    <Icon
                                        className={`w-5 h-5 transition-all duration-300 ${isActive
                                            ? 'text-white'
                                            : 'text-primary-600 group-hover:text-primary-700'
                                            }`}
                                    />
                                </div>

                                {/* Text content */}
                                <div className="relative z-10 flex-1 min-w-0">
                                    <p className={`text-sm font-semibold transition-all duration-300 ${isActive ? 'text-white' : 'text-neutral-800 group-hover:text-neutral-900'
                                        }`}>
                                        {item.name}
                                    </p>
                                    <p className={`text-xs mt-0.5 transition-all duration-300 ${isActive
                                        ? 'text-white/80'
                                        : 'text-neutral-500 group-hover:text-neutral-600'
                                        }`}>
                                        {item.description}
                                    </p>
                                </div>

                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/40 rounded-l-full" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-alice-blue">
                    <div className="bg-gradient-to-br from-alice-blue/70 via-white/60 to-primary-100/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-soft">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-soft">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                                BayiCare v1.0
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                            Berdasarkan standar WHO & Kemenkes RI
                        </p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                            <div className="w-1 h-1 bg-primary-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-secondary-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-accent-400 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}