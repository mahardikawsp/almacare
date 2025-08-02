'use client'

import * as React from 'react'
import {
    GrowthChartCard,
    ImmunizationCard,
    MPASICard,
    QuickActionCard,
    DashboardStats,
    type StatItem
} from '@/components/ui/composite'
import {
    Activity,
    Shield,
    Utensils,
    Plus,
    Calendar,
    FileText,
    Users,
    TrendingUp,
    Clock,
    Heart
} from 'lucide-react'

export function CompositeDemo() {
    // Mock data for demonstration
    const mockChild = {
        id: '1',
        name: 'Aisyah',
        gender: 'FEMALE' as const,
        birthDate: new Date('2023-06-15'),
        ageInMonths: 8
    }

    const mockGrowthRecord = {
        id: '1',
        childId: '1',
        date: new Date(),
        weight: 8.5,
        height: 68,
        headCircumference: 44,
        ageInMonths: 8,
        analysis: {
            weightForAge: {
                indicator: 'Weight-for-age',
                zScore: 0.2,
                status: 'normal' as const,
                message: 'Berat badan normal'
            },
            heightForAge: {
                indicator: 'Height-for-age',
                zScore: -0.1,
                status: 'normal' as const,
                message: 'Tinggi badan normal'
            },
            weightForHeight: {
                indicator: 'Weight-for-height',
                zScore: 0.5,
                status: 'normal' as const,
                message: 'Status gizi normal'
            }
        }
    }

    const mockImmunizationStats = {
        total: 12,
        completed: 8,
        scheduled: 3,
        overdue: 1
    }

    const mockUpcomingImmunizations = [
        {
            id: '1',
            vaccineName: 'DPT-HB-Hib 3',
            vaccineType: 'DPT',
            scheduledDate: new Date('2024-02-15'),
            status: 'SCHEDULED' as const,
            isOptional: false,
            isOverdue: false,
            daysUntilDue: 7
        },
        {
            id: '2',
            vaccineName: 'Polio 3',
            vaccineType: 'Polio',
            scheduledDate: new Date('2024-01-20'),
            status: 'OVERDUE' as const,
            isOptional: false,
            isOverdue: true,
            daysUntilDue: -5
        }
    ]

    const mockFavoriteRecipes = [
        {
            id: '1',
            name: 'Bubur Ayam Wortel',
            ageRangeMin: 6,
            ageRangeMax: 12,
            texture: 'SMOOTH' as const,
            nutrition: {
                calories: 120,
                protein: 8,
                fat: 3,
                carbohydrates: 15
            },
            ingredients: [],
            instructions: [],
            isFavorite: true
        },
        {
            id: '2',
            name: 'Pure Pisang Alpukat',
            ageRangeMin: 6,
            ageRangeMax: 8,
            texture: 'SMOOTH' as const,
            nutrition: {
                calories: 95,
                protein: 2,
                fat: 5,
                carbohydrates: 12
            },
            ingredients: [],
            instructions: [],
            isFavorite: true
        }
    ]

    const mockTodayMenu = {
        date: new Date(),
        meals: {
            BREAKFAST: {
                id: '1',
                recipe: mockFavoriteRecipes[0],
                mealType: 'BREAKFAST' as const,
                scheduledTime: new Date()
            }
        },
        totalNutrition: {
            calories: 120,
            protein: 8,
            fat: 3,
            carbohydrates: 15
        }
    }

    const mockNutritionSummary = {
        daily: {
            calories: 450,
            protein: 18,
            fat: 12,
            carbohydrates: 65
        },
        recommended: {
            calories: 600,
            protein: 20,
            fat: 15,
            carbohydrates: 80
        },
        percentage: {
            calories: 75,
            protein: 90,
            fat: 80,
            carbohydrates: 81
        }
    }

    const mockStats: StatItem[] = [
        {
            id: 'growth',
            label: 'Pengukuran Terakhir',
            value: '3 hari lalu',
            icon: Activity,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            description: 'Berat: 8.5kg, Tinggi: 68cm',
            change: {
                value: 5,
                type: 'increase',
                period: 'dari bulan lalu'
            }
        },
        {
            id: 'immunization',
            label: 'Imunisasi Selesai',
            value: '8/12',
            icon: Shield,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            description: '1 imunisasi terlambat',
            change: {
                value: 12,
                type: 'increase',
                period: 'bulan ini'
            }
        },
        {
            id: 'mpasi',
            label: 'Menu Hari Ini',
            value: '3/4',
            icon: Utensils,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            description: 'Nutrisi 75% tercukupi'
        },
        {
            id: 'favorites',
            label: 'Resep Favorit',
            value: '12',
            icon: Heart,
            color: 'text-pink-600',
            bgColor: 'bg-pink-100',
            description: 'Resep yang disukai anak'
        }
    ]

    const quickActions = [
        {
            id: 'add-growth',
            title: 'Catat Pertumbuhan',
            description: 'Tambah data berat dan tinggi badan',
            icon: Plus,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-100',
            priority: 'high' as const
        },
        {
            id: 'schedule-immunization',
            title: 'Jadwal Imunisasi',
            description: 'Lihat dan atur jadwal vaksinasi',
            icon: Calendar,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100',
            badge: {
                text: '1 terlambat',
                color: 'text-red-700',
                bgColor: 'bg-red-100'
            }
        },
        {
            id: 'plan-menu',
            title: 'Rencanakan Menu',
            description: 'Buat menu MPASI untuk minggu ini',
            icon: Utensils,
            iconColor: 'text-orange-600',
            iconBgColor: 'bg-orange-100'
        },
        {
            id: 'view-reports',
            title: 'Laporan Kesehatan',
            description: 'Unduh laporan perkembangan anak',
            icon: FileText,
            iconColor: 'text-purple-600',
            iconBgColor: 'bg-purple-100'
        }
    ]

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-berkeley-blue mb-2">
                    Composite Components Demo
                </h1>
                <p className="text-gray-600">
                    BayiCare-specific composite components built with shadcn/ui
                </p>
            </div>

            {/* Dashboard Stats */}
            <section>
                <h2 className="text-xl font-semibold text-berkeley-blue mb-4">
                    Dashboard Stats
                </h2>
                <DashboardStats
                    title="Ringkasan Kesehatan"
                    description="Statistik perkembangan anak dalam sebulan terakhir"
                    stats={mockStats}
                    columns={4}
                    onStatClick={(statId) => console.log('Clicked stat:', statId)}
                />
            </section>

            {/* Health Data Cards */}
            <section>
                <h2 className="text-xl font-semibold text-berkeley-blue mb-4">
                    Health Data Cards
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <GrowthChartCard
                        child={mockChild}
                        latestRecord={mockGrowthRecord}
                        recordCount={15}
                        onViewChart={() => console.log('View growth chart')}
                        onAddRecord={() => console.log('Add growth record')}
                        onExportData={() => console.log('Export growth data')}
                    />

                    <ImmunizationCard
                        child={mockChild}
                        stats={mockImmunizationStats}
                        upcomingImmunizations={mockUpcomingImmunizations}
                        onViewSchedule={() => console.log('View immunization schedule')}
                        onAddRecord={() => console.log('Add immunization record')}
                        onViewDetails={(id) => console.log('View immunization details:', id)}
                    />

                    <MPASICard
                        child={mockChild}
                        todayMenu={mockTodayMenu}
                        favoriteRecipes={mockFavoriteRecipes}
                        nutritionSummary={mockNutritionSummary}
                        onViewMenu={() => console.log('View MPASI menu')}
                        onViewRecipes={() => console.log('View recipes')}
                        onPlanMenu={() => console.log('Plan menu')}
                        onViewNutrition={() => console.log('View nutrition')}
                    />
                </div>
            </section>

            {/* Quick Action Cards */}
            <section>
                <h2 className="text-xl font-semibold text-berkeley-blue mb-4">
                    Quick Action Cards
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <QuickActionCard
                            key={action.id}
                            title={action.title}
                            description={action.description}
                            icon={action.icon}
                            iconColor={action.iconColor}
                            iconBgColor={action.iconBgColor}
                            badge={action.badge}
                            priority={action.priority}
                            onAction={() => console.log('Quick action:', action.id)}
                        />
                    ))}
                </div>
            </section>

            {/* Loading States */}
            <section>
                <h2 className="text-xl font-semibold text-berkeley-blue mb-4">
                    Loading States
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <GrowthChartCard
                        child={mockChild}
                        recordCount={0}
                        isLoading={true}
                    />

                    <ImmunizationCard
                        child={mockChild}
                        stats={{ total: 0, completed: 0, scheduled: 0, overdue: 0 }}
                        upcomingImmunizations={[]}
                        isLoading={true}
                    />

                    <MPASICard
                        child={mockChild}
                        favoriteRecipes={[]}
                        isLoading={true}
                    />
                </div>
            </section>

            {/* Disabled States */}
            <section>
                <h2 className="text-xl font-semibold text-berkeley-blue mb-4">
                    Disabled States
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <QuickActionCard
                        title="Disabled Action"
                        description="This action is currently disabled"
                        icon={Users}
                        disabled={true}
                        onAction={() => console.log('This should not fire')}
                    />

                    <QuickActionCard
                        title="Loading Action"
                        description="This action is currently loading"
                        icon={TrendingUp}
                        loading={true}
                        onAction={() => console.log('This should not fire')}
                    />
                </div>
            </section>
        </div>
    )
}