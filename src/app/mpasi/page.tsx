'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { Child } from '@/types'
import { RecipeList } from '@/components/mpasi/RecipeList'
import { FavoriteRecipes } from '@/components/mpasi/FavoriteRecipes'
import { NutritionCharts } from '@/components/mpasi/NutritionCharts'
import { Button } from '@/components/ui/Button'
import { ChefHat, Calendar, Utensils, Heart, BarChart3 } from 'lucide-react'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { MPASIIcon } from '@/components/icons/MPASIIcon'

export default function MPASIPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [children, setChildren] = useState<Child[]>([])
    const [selectedChild, setSelectedChild] = useState<Child | null>(null)
    const [activeTab, setActiveTab] = useState<'recipes' | 'favorites' | 'nutrition'>('recipes')
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
                    <ChefHat className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                        Pilih Anak Terlebih Dahulu
                    </h2>
                    <p className="text-neutral-600 mb-6 font-medium">
                        Tambahkan data anak terlebih dahulu untuk mengakses resep MPASI yang sesuai dengan usia.
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

    const tabs = [
        { id: 'recipes', label: 'Semua Resep', icon: Utensils },
        { id: 'favorites', label: 'Favorit', icon: Heart },
        { id: 'nutrition', label: 'Grafik Nutrisi', icon: BarChart3 }
    ]

    return (
        <AuthGuard>
            <AppLayout>
                <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50">
                    <div className="p-4 sm:p-6">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                            {/* <div className="w-12 h-12 bg-gradient-to-br from-picton-blue to-berkeley-blue rounded-2xl flex items-center justify-center shadow-soft">
                                <MPASIIcon className="w-6 h-6 text-white" />
                            </div> */}
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-900">
                                    Resep MPASI
                                </h1>
                                <p className="text-neutral-600 font-medium">
                                    Temukan resep MPASI yang sesuai dengan usia {selectedChild?.name}
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

                        {/* Menu Planning Link */}
                        <div className="bg-white rounded-2xl p-4 shadow-soft mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900">Jadwal Menu MPASI</h3>
                                        <p className="text-sm text-neutral-600">Rencanakan menu harian dan mingguan</p>
                                    </div>
                                </div>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => router.push('/mpasi/menu-planning')}
                                >
                                    Buka
                                </Button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="mb-6">
                            <div className="bg-white rounded-2xl p-2 shadow-soft">
                                <div className="flex space-x-1">
                                    {tabs.map((tab) => {
                                        const IconComponent = tab.icon
                                        return (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => setActiveTab(tab.id as 'recipes' | 'favorites' | 'nutrition')}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id
                                                    ? 'bg-picton-blue text-white shadow-warm'
                                                    : 'text-gray hover:bg-alice-blue hover:text-berkeley-blue'
                                                    }`}
                                            >
                                                <IconComponent className="w-5 h-5" />
                                                <span className="hidden sm:inline">{tab.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-6">
                            {activeTab === 'recipes' && (
                                <RecipeList selectedChild={selectedChild || undefined} />
                            )}
                            {activeTab === 'favorites' && selectedChild && (
                                <FavoriteRecipes selectedChild={selectedChild} />
                            )}
                            {activeTab === 'nutrition' && selectedChild && (
                                <NutritionCharts childId={selectedChild.id} />
                            )}
                        </div>
                    </div>
                </div>
            </AppLayout>
        </AuthGuard>
    )
}