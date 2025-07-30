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
        color: 'from-primary-500 to-primary-600'
    },
    {
        name: 'Kelola Anak',
        href: '/children',
        icon: ChildIcon,
        activePattern: /^\/children/,
        description: 'Tambah dan kelola profil anak',
        color: 'from-purple-500 to-purple-600'
    },
    {
        name: 'Pertumbuhan',
        href: '/growth',
        icon: GrowthIcon,
        activePattern: /^\/growth/,
        description: 'Catat dan pantau pertumbuhan',
        color: 'from-accent-500 to-accent-600'
    },
    {
        name: 'Imunisasi',
        href: '/immunization',
        icon: ImmunizationIcon,
        activePattern: /^\/immunization/,
        description: 'Jadwal dan riwayat imunisasi',
        color: 'from-blue-500 to-blue-600'
    },
    {
        name: 'MPASI',
        href: '/mpasi',
        icon: MPASIIcon,
        activePattern: /^\/mpasi/,
        description: 'Resep dan menu makanan bayi',
        color: 'from-secondary-500 to-secondary-600'
    },
    {
        name: 'Grafik & Laporan',
        href: '/reports',
        icon: ChartIcon,
        activePattern: /^\/reports/,
        description: 'Visualisasi data dan laporan',
        color: 'from-indigo-500 to-indigo-600'
    }
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden md:flex md:flex-col md:w-64 lg:w-72 bg-gradient-to-b from-pink-100/80 via-blue-100/60 to-purple-100/80 border-r border-pink-200/50 min-h-screen shadow-large backdrop-blur-sm">
            <div className="flex-1 flex flex-col">
                {/* Child Switcher */}
                <div className="p-4 border-b border-pink-200/50 bg-gradient-to-r from-pink-50/60 to-blue-50/60">
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
                                    ? 'text-white shadow-large transform scale-[1.02]'
                                    : 'text-neutral-700 hover:bg-gradient-to-r hover:from-white/70 hover:to-pink-50/60 hover:shadow-medium hover:scale-[1.01]'
                                    }`}
                            >
                                {/* Active background gradient */}
                                {isActive && (
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl`} />
                                )}

                                {/* Hover background */}
                                {!isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-pink-100/40 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                )}

                                {/* Icon container */}
                                <div className={`relative z-10 p-2 rounded-xl transition-all duration-300 ${isActive
                                    ? 'bg-white/20 backdrop-blur-sm'
                                    : 'bg-gradient-to-br from-white/70 to-pink-100/50 group-hover:from-white/90 group-hover:to-pink-100/70'
                                    }`}>
                                    <Icon
                                        className={`w-5 h-5 transition-all duration-300 ${isActive
                                            ? 'text-white'
                                            : 'text-purple-600 group-hover:text-pink-700'
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
                <div className="p-4 border-t border-pink-200/50">
                    <div className="bg-gradient-to-br from-pink-100/60 via-white/50 to-blue-100/60 backdrop-blur-sm rounded-2xl p-4 text-center shadow-soft">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-soft">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
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