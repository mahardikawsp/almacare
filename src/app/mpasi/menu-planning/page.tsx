'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { MenuPlanningCalendar } from '@/components/mpasi/MenuPlanningCalendar'
import { WeeklyMenuView } from '@/components/mpasi/WeeklyMenuView'
import { NutritionSummary } from '@/components/mpasi/NutritionSummary'
import { Button } from '@/components/ui/Button'
import { Child } from '@/types'
import { Calendar, ChefHat, BarChart3 } from 'lucide-react'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { MPASIIcon } from '@/components/icons/MPASIIcon'

export default function MenuPlanningPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [children, setChildren] = useState<Child[]>([])
    const [selectedChild, setSelectedChild] = useState<Child | null>(null)
    const [activeView, setActiveView] = useState<'daily' | 'weekly' | 'nutrition'>('daily')
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        }
    }, [status, router])

    useEffect(() => {
        const fetchChildren = async () => {
            if (!session?.user?.id) return

            try {
                const response = await fetch('/api/children')
                const data = await response.json()

                if (data.children) {
                    setChildren(data.children)
                    if (data.children.length > 0) {
                        setSelectedChild(data.children[0])
                    }
                }
            } catch (error) {
                console.error('Error fetching children:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchChildren()
    }, [session])

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-baby-gradient flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    if (children.length === 0) {
        return (
            <div className="min-h-screen bg-baby-gradient flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-2xl shadow-soft max-w-md mx-4">
                    <Calendar className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                        Pilih Anak Terlebih Dahulu
                    </h2>
                    <p className="text-neutral-600 mb-6 font-medium">
                        Tambahkan data anak terlebih dahulu untuk membuat jadwal menu MPASI.
                    </p>
                    <Button
                        onClick={() => router.push('/children')}
                        variant="primary"
                    >
                        Tambah Data Anak
                    </Button>
                </div>
            </div>
        )
    }

    const views = [
        { id: 'daily', label: 'Harian', icon: Calendar },
        { id: 'weekly', label: 'Mingguan', icon: ChefHat },
        { id: 'nutrition', label: 'Nutrisi', icon: BarChart3 }
    ]

    return (
        <AuthGuard>
            <AppLayout>
                <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50">
                    <div className="p-4 sm:p-6">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-picton-blue to-berkeley-blue rounded-2xl flex items-center justify-center shadow-soft">
                                <MPASIIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 truncate">
                                    Jadwal Menu MPASI
                                </h1>
                                <p className="text-sm sm:text-base text-neutral-600 font-medium truncate">
                                    Rencanakan menu harian dan mingguan untuk {selectedChild?.name}
                                </p>
                            </div>
                        </div>

                        {/* Child Selector */}
                        {children.length > 1 && (
                            <div className="bg-white rounded-2xl p-4 shadow-soft mb-6">
                                <label htmlFor="child-selector" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Pilih Anak
                                </label>
                                <div className="relative">
                                    <select
                                        id="child-selector"
                                        value={selectedChild?.id || ''}
                                        onChange={(e) => {
                                            const child = children.find(c => c.id === e.target.value)
                                            setSelectedChild(child || null)
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

                        {/* View Tabs */}
                        <div className="mb-6">
                            <div className="bg-white rounded-2xl p-2 shadow-soft">
                                <div className="flex space-x-1">
                                    {views.map((view) => {
                                        const IconComponent = view.icon
                                        return (
                                            <button
                                                key={view.id}
                                                type="button"
                                                onClick={() => setActiveView(view.id as 'daily' | 'weekly' | 'nutrition')}
                                                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-3 rounded-xl font-medium transition-all text-xs sm:text-sm ${activeView === view.id
                                                    ? 'bg-picton-blue text-white shadow-warm'
                                                    : 'text-gray hover:bg-alice-blue hover:text-berkeley-blue'
                                                    }`}
                                            >
                                                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span className="sm:hidden text-xs">{view.label}</span>
                                                <span className="hidden sm:inline">{view.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-4 sm:space-y-6">
                            {activeView === 'daily' && selectedChild && (
                                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft">
                                    <MenuPlanningCalendar
                                        selectedChild={selectedChild}
                                        selectedDate={selectedDate}
                                        onDateChange={setSelectedDate}
                                    />
                                </div>
                            )}
                            {activeView === 'weekly' && selectedChild && (
                                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft">
                                    <WeeklyMenuView
                                        selectedChild={selectedChild}
                                        selectedDate={selectedDate}
                                        onDateChange={setSelectedDate}
                                    />
                                </div>
                            )}
                            {activeView === 'nutrition' && selectedChild && (
                                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft">
                                    <NutritionSummary
                                        selectedChild={selectedChild}
                                        selectedDate={selectedDate}
                                        onDateChange={setSelectedDate}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AppLayout>
        </AuthGuard>
    )
}