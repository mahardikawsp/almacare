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
import { cn } from '@/lib/utils'

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
        <aside className={cn(
            "hidden md:flex md:flex-col md:w-64 lg:w-72 min-h-screen",
            "bg-gradient-to-b from-muted/30 via-muted/20 to-muted/30",
            "border-r border-border shadow-lg backdrop-blur-sm",
            // Safe area handling for horizontal insets
            "pl-[max(0rem,env(safe-area-inset-left))]"
        )}>
            <div className="flex-1 flex flex-col">
                {/* Child Switcher */}
                <div className="p-4 border-b border-border bg-gradient-to-r from-accent/20 to-muted/30">
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
                                className={cn(
                                    "relative flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group overflow-hidden",
                                    isActive
                                        ? "bg-primary/10 text-primary shadow-sm border-l-4 border-primary hover:bg-primary/15"
                                        : "text-foreground/80 hover:bg-accent/20 hover:text-foreground hover:shadow-sm"
                                )}
                            >
                                {/* Icon container */}
                                <div className={cn(
                                    "relative z-10 p-2 rounded-lg transition-all duration-300",
                                    isActive
                                        ? "bg-primary/10"
                                        : "bg-accent/10 group-hover:bg-accent/20"
                                )}>
                                    <Icon
                                        className={cn(
                                            "w-5 h-5 transition-all duration-300",
                                            isActive
                                                ? "text-primary"
                                                : "text-foreground/70 group-hover:text-foreground"
                                        )}
                                    />
                                </div>

                                {/* Text content */}
                                <div className="relative z-10 flex-1 min-w-0">
                                    <p className={cn(
                                        "text-sm font-medium transition-all duration-300",
                                        isActive 
                                            ? "text-foreground" 
                                            : "text-foreground/90 group-hover:text-foreground"
                                    )}>
                                        {item.name}
                                    </p>
                                    <p className={cn(
                                        "text-xs mt-0.5 transition-all duration-300",
                                        isActive
                                            ? "text-foreground/70"
                                            : "text-muted-foreground group-hover:text-muted-foreground/90"
                                    )}>
                                        {item.description}
                                    </p>
                                </div>

                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer with modern shadcn/ui styling */}
                <div className="p-4 border-t border-border">
                    <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-border/50">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-lg flex items-center justify-center shadow-sm">
                                <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold text-foreground">
                                BayiCare v1.0
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Berdasarkan standar WHO & Kemenkes RI
                        </p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                            <div className="w-1 h-1 bg-primary rounded-full"></div>
                            <div className="w-1 h-1 bg-primary/60 rounded-full"></div>
                            <div className="w-1 h-1 bg-primary/40 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}