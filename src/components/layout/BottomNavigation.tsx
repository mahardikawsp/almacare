'use client'

import { HomeIcon } from '../icons/HomeIcon'
import { GrowthIcon } from '../icons/GrowthIcon'
import { ImmunizationIcon } from '../icons/ImmunizationIcon'
import { MPASIIcon } from '../icons/MPASIIcon'
import { MobileNav, type MobileNavItem } from '@/components/ui/layout/mobile-nav'

const navigationItems: MobileNavItem[] = [
    {
        href: '/dashboard',
        label: 'Beranda',
        icon: <HomeIcon className="w-6 h-6" />
    },
    {
        href: '/growth',
        label: 'Pertumbuhan',
        icon: <GrowthIcon className="w-6 h-6" />
    },
    {
        href: '/immunization',
        label: 'Imunisasi',
        icon: <ImmunizationIcon className="w-6 h-6" />
    },
    {
        href: '/mpasi',
        label: 'MPASI',
        icon: <MPASIIcon className="w-6 h-6" />
    }
]

export function BottomNavigation() {
    return <MobileNav items={navigationItems} />
}