'use client'

import { useState } from 'react'
import { Texture } from '@prisma/client'
import { MPASIService } from '@/lib/mpasi-service'
import { Button } from '@/components/ui/Button'
import { Search, Filter } from 'lucide-react'

interface RecipeFiltersProps {
    onFiltersChange: (filters: {
        search: string
        ageMin: number | undefined
        ageMax: number | undefined
        texture: Texture | 'all'
    }) => void
    childAge?: number
}

export function RecipeFilters({ onFiltersChange, childAge }: RecipeFiltersProps) {
    const [search, setSearch] = useState('')
    const [ageMin, setAgeMin] = useState<number | undefined>(undefined)
    const [ageMax, setAgeMax] = useState<number | undefined>(undefined)
    const [texture, setTexture] = useState<Texture | 'all'>('all')
    const [showAdvanced, setShowAdvanced] = useState(false)

    const handleApplyFilters = () => {
        onFiltersChange({
            search: search.trim(),
            ageMin,
            ageMax,
            texture
        })
    }

    const handleReset = () => {
        setSearch('')
        setAgeMin(undefined)
        setAgeMax(undefined)
        setTexture('all')
        onFiltersChange({
            search: '',
            ageMin: undefined,
            ageMax: undefined,
            texture: 'all'
        })
    }

    const handleChildAgeFilter = () => {
        if (childAge && childAge >= 6) {
            setAgeMin(Math.max(6, childAge - 1))
            setAgeMax(childAge + 2)

            // Set appropriate texture based on age
            const recommendedTextures = MPASIService.getTextureRecommendations(childAge)
            if (recommendedTextures.length > 0) {
                setTexture(recommendedTextures[0])
            }
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-4 mb-6">
            {/* Search Bar */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                <input
                    type="text"
                    placeholder="Cari resep MPASI..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                />
            </div>

            {/* Quick Filter for Child Age */}
            {childAge && childAge >= 6 && (
                <div className="mb-4">
                    <button
                        type="button"
                        onClick={handleChildAgeFilter}
                        className="bg-primary-50 text-primary-700 border border-primary-200 px-3 py-2 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors"
                    >
                        Sesuai Usia Anak ({childAge} bulan)
                    </button>
                </div>
            )}

            {/* Advanced Filters Toggle */}
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                    <Filter size={16} />
                    Filter Lanjutan
                </button>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="space-y-4 border-t pt-4">
                    {/* Age Range */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Rentang Usia (bulan)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-neutral-500 mb-1">Minimum</label>
                                <input
                                    type="number"
                                    min="6"
                                    max="24"
                                    value={ageMin || ''}
                                    onChange={(e) => setAgeMin(e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="6"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-neutral-500 mb-1">Maksimum</label>
                                <input
                                    type="number"
                                    min="6"
                                    max="24"
                                    value={ageMax || ''}
                                    onChange={(e) => setAgeMax(e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="24"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Texture Filter */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Tekstur Makanan
                        </label>
                        <select
                            value={texture}
                            onChange={(e) => setTexture(e.target.value as Texture | 'all')}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="all">Semua Tekstur</option>
                            <option value="PUREE">Bubur Halus</option>
                            <option value="MASHED">Bubur Kasar</option>
                            <option value="FINGER_FOOD">Makanan Jari</option>
                            <option value="FAMILY_FOOD">Makanan Keluarga</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
                <button
                    type="button"
                    onClick={handleApplyFilters}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-xl font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    Terapkan Filter
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    className="bg-neutral-100 text-neutral-700 border border-neutral-300 px-4 py-2 rounded-xl font-medium hover:bg-neutral-200 transition-colors"
                >
                    Reset
                </button>
            </div>
        </div>
    )
}