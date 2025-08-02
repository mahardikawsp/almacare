'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { useChildStore } from '@/stores/childStore'
import { ImmunizationCalendar } from '@/components/immunization/ImmunizationCalendar'
import { ImmunizationStats } from '@/components/immunization/ImmunizationStats'
import { UpcomingImmunizations } from '@/components/immunization/UpcomingImmunizations'
import { OverdueImmunizations } from '@/components/immunization/OverdueImmunizations'
import { ImmunizationIcon } from '@/components/icons/ImmunizationIcon'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'

export default function ImmunizationPage() {
    const { status } = useSession()
    const router = useRouter()
    const { selectedChild, children } = useChildStore()
    const [activeTab, setActiveTab] = useState<'calendar' | 'upcoming' | 'overdue' | 'stats'>('calendar')

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        }
    }, [status, router])

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-baby-gradient flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    if (!selectedChild) {
        return (
            <div className="min-h-screen bg-baby-gradient flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-2xl shadow-soft max-w-md mx-4">
                    <ImmunizationIcon className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                        Pilih Anak Terlebih Dahulu
                    </h2>
                    <p className="text-neutral-600 mb-6 font-medium">
                        Silakan pilih anak untuk melihat jadwal imunisasi
                    </p>
                    <Button
                        onClick={() => router.push('/children')}
                        variant="primary"
                    >
                        Pilih Anak
                    </Button>
                </div>
            </div>
        )
    }

    const tabs = [
        { id: 'calendar', label: 'Kalender', icon: '📅' },
        { id: 'upcoming', label: 'Mendatang', icon: '⏰' },
        { id: 'overdue', label: 'Terlambat', icon: '⚠️' },
        { id: 'stats', label: 'Statistik', icon: '📊' }
    ]

    return (
        <AuthGuard>
            <AppLayout>
                <div className='min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50'>
                    <div className="p-4 sm:p-6">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-picton-blue to-berkeley-blue rounded-2xl flex items-center justify-center shadow-soft">
                                    <ImmunizationIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-neutral-900">
                                        Jadwal Imunisasi
                                    </h1>
                                    <p className="text-neutral-600 font-medium">
                                        Pantau jadwal imunisasi {selectedChild.name}
                                    </p>
                                </div>
                            </div>

                            {/* Child Selector */}
                            {children.length > 1 && (
                                <div className="bg-white rounded-2xl p-4 shadow-soft">
                                    <label htmlFor="child-selector" className="block text-sm font-medium text-neutral-700 mb-2">
                                        Pilih Anak
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="child-selector"
                                            value={selectedChild.id}
                                            onChange={(e) => {
                                                const child = children.find(c => c.id === e.target.value)
                                                if (child) useChildStore.getState().setSelectedChild(child)
                                            }}
                                            className="form-input w-full pr-10 appearance-none"
                                        >
                                            {children.map((child) => (
                                                <option key={child.id} value={child.id}>
                                                    {child.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="mb-6">
                            <div className="bg-white rounded-2xl p-2 shadow-soft">
                                <div className="flex space-x-1">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id as 'calendar' | 'upcoming' | 'overdue' | 'stats')}
                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id
                                                ? 'bg-picton-blue text-white shadow-warm'
                                                : 'text-gray hover:bg-alice-blue hover:text-berkeley-blue'
                                                }`}
                                        >
                                            <span>{tab.icon}</span>
                                            <span className="hidden sm:inline">{tab.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-6">
                            {activeTab === 'calendar' && (
                                <ImmunizationCalendar childId={selectedChild.id} />
                            )}
                            {activeTab === 'upcoming' && (
                                <UpcomingImmunizations childId={selectedChild.id} />
                            )}
                            {activeTab === 'overdue' && (
                                <OverdueImmunizations childId={selectedChild.id} />
                            )}
                            {activeTab === 'stats' && (
                                <ImmunizationStats childId={selectedChild.id} />
                            )}
                        </div>
                    </div>
                </div>
            </AppLayout>
        </AuthGuard>
    )
}