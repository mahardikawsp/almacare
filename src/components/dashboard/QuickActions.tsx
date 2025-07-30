'use client'

import { useRouter } from 'next/navigation'
import { useChildStore } from '@/stores/childStore'
import { PlusIcon } from '@/components/icons/PlusIcon'
import { GrowthIcon } from '@/components/icons/GrowthIcon'
import { ImmunizationIcon } from '@/components/icons/ImmunizationIcon'
import { MPASIIcon } from '@/components/icons/MPASIIcon'
import { ChartIcon } from '@/components/icons/ChartIcon'

interface QuickAction {
    id: string
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    href: string
    color: string
    bgColor: string
    textColor: string
    requiresChild?: boolean
}

export function QuickActions() {
    const { children } = useChildStore()
    const router = useRouter()
    const hasChildren = children.length > 0

    const quickActions: QuickAction[] = [
        {
            id: 'add-child',
            title: 'Tambah Anak',
            description: 'Daftarkan profil anak baru',
            icon: PlusIcon,
            href: '/children/add',
            color: 'primary',
            bgColor: 'bg-primary-50',
            textColor: 'text-primary-600',
            requiresChild: false
        },
        {
            id: 'record-growth',
            title: 'Catat Pertumbuhan',
            description: 'Tambah data berat & tinggi badan',
            icon: GrowthIcon,
            href: '/growth',
            color: 'secondary',
            bgColor: 'bg-secondary-50',
            textColor: 'text-secondary-600',
            requiresChild: true
        },
        {
            id: 'view-immunization',
            title: 'Jadwal Imunisasi',
            description: 'Lihat & update status vaksin',
            icon: ImmunizationIcon,
            href: '/immunization',
            color: 'accent',
            bgColor: 'bg-accent-50',
            textColor: 'text-accent-600',
            requiresChild: true
        },
        {
            id: 'mpasi-recipes',
            title: 'Resep MPASI',
            description: 'Cari menu makanan sehat',
            icon: MPASIIcon,
            href: '/mpasi',
            color: 'primary',
            bgColor: 'bg-primary-50',
            textColor: 'text-primary-600',
            requiresChild: false
        },
        {
            id: 'growth-charts',
            title: 'Grafik Pertumbuhan',
            description: 'Lihat perkembangan anak',
            icon: ChartIcon,
            href: '/growth',
            color: 'secondary',
            bgColor: 'bg-secondary-50',
            textColor: 'text-secondary-600',
            requiresChild: true
        },
        {
            id: 'menu-planning',
            title: 'Perencanaan Menu',
            description: 'Atur jadwal makan MPASI',
            icon: MPASIIcon,
            href: '/mpasi/menu-planning',
            color: 'primary',
            bgColor: 'bg-primary-50',
            textColor: 'text-primary-600',
            requiresChild: true
        }
    ]

    const handleActionClick = (action: QuickAction) => {
        if (action.requiresChild && !hasChildren) {
            // Show message or redirect to add child first
            router.push('/children/add')
            return
        }
        router.push(action.href)
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Aksi Cepat
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {quickActions.map((action) => {
                    const IconComponent = action.icon
                    const isDisabled = action.requiresChild && !hasChildren

                    return (
                        <button
                            key={action.id}
                            onClick={() => handleActionClick(action)}
                            disabled={isDisabled}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 text-center group ${isDisabled
                                ? 'border-neutral-200 bg-neutral-50 opacity-50 cursor-not-allowed'
                                : `border-dashed ${action.bgColor} border-${action.color}-300 hover:border-${action.color}-400 hover:bg-${action.color}-100`
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2 transition-colors ${isDisabled
                                ? 'bg-neutral-100'
                                : `bg-${action.color}-100 group-hover:bg-${action.color}-200`
                                }`}>
                                <IconComponent className={`w-4 h-4 ${isDisabled ? 'text-neutral-400' : action.textColor
                                    }`} />
                            </div>
                            <p className={`text-xs font-semibold mb-1 ${isDisabled ? 'text-neutral-400' : action.textColor
                                }`}>
                                {action.title}
                            </p>
                            <p className={`text-xs leading-tight ${isDisabled ? 'text-neutral-400' : 'text-neutral-600'
                                }`}>
                                {action.description}
                            </p>
                        </button>
                    )
                })}
            </div>

            {!hasChildren && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-700 text-center">
                        💡 Tambahkan profil anak terlebih dahulu untuk mengakses semua fitur
                    </p>
                </div>
            )}
        </div>
    )
}