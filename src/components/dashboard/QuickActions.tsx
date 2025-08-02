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
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
                Aksi Cepat
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {quickActions.map((action) => {
                    const IconComponent = action.icon
                    const isDisabled = action.requiresChild && !hasChildren

                    return (
                        <button
                            key={action.id}
                            onClick={() => handleActionClick(action)}
                            disabled={isDisabled}
                            className={`p-4 rounded-2xl transition-all duration-300 text-center group min-h-[100px] flex flex-col justify-center relative overflow-hidden ${isDisabled
                                ? 'bg-gray-50 opacity-50 cursor-not-allowed'
                                : `${action.bgColor} hover:scale-105 hover:shadow-lg`
                                }`}
                        >
                            {/* Background decoration */}
                            {!isDisabled && (
                                <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-20 rounded-full -translate-y-8 translate-x-8"></div>
                            )}

                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors relative z-10 ${isDisabled
                                ? 'bg-gray-100'
                                : 'bg-white shadow-sm'
                                }`}>
                                <IconComponent className={`w-6 h-6 ${isDisabled ? 'text-gray-400' : action.textColor
                                    }`} />
                            </div>
                            <p className={`text-sm font-semibold mb-1 leading-tight relative z-10 ${isDisabled ? 'text-gray-400' : 'text-gray-900'
                                }`}>
                                {action.title}
                            </p>
                            <p className={`text-xs leading-tight relative z-10 ${isDisabled ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                {action.description}
                            </p>
                        </button>
                    )
                })}
            </div>

            {!hasChildren && (
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">💡</span>
                        </div>
                        <p className="text-sm text-amber-800 leading-relaxed">
                            Tambahkan profil anak terlebih dahulu untuk mengakses semua fitur
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}