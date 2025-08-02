'use client'

import { useEffect, useState } from 'react'
import { useChildStore } from '@/stores/childStore'
import { useGrowthStore } from '@/stores/growthStore'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { PlusIcon } from '@/components/icons/PlusIcon'
import { useRouter } from 'next/navigation'

interface ChildData {
    id: string
    name: string
    gender: 'MALE' | 'FEMALE'
    birthDate: Date
    relationship: string
    ageInMonths: number
    latestGrowth?: {
        weight: number
        height: number
        date: Date
        weightForAgeZScore: number
        heightForAgeZScore: number
    }
    upcomingImmunizations: Array<{
        vaccineName: string
        scheduledDate: Date
        daysUntil: number
    }>
}

export function ChildOverview() {
    const { children, selectedChild, setSelectedChild } = useChildStore()
    const { getLatestRecord } = useGrowthStore()
    const [childrenData, setChildrenData] = useState<ChildData[]>([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const calculateAge = (birthDate: Date) => {
        const now = new Date()
        const birth = new Date(birthDate)
        const diffTime = Math.abs(now.getTime() - birth.getTime())
        const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44))
        return diffMonths
    }

    const formatAge = (ageInMonths: number) => {
        if (ageInMonths < 12) {
            return `${ageInMonths} bulan`
        }
        const years = Math.floor(ageInMonths / 12)
        const months = ageInMonths % 12
        if (months === 0) {
            return `${years} tahun`
        }
        return `${years} tahun ${months} bulan`
    }

    const getGrowthStatus = (zScore: number) => {
        if (zScore < -2) return { status: 'Kurang', color: 'text-red-600' }
        if (zScore > 2) return { status: 'Berlebih', color: 'text-orange-600' }
        return { status: 'Normal', color: 'text-green-600' }
    }

    useEffect(() => {
        const fetchChildrenData = async () => {
            if (children.length === 0) {
                setChildrenData([])
                setIsLoading(false)
                return
            }

            try {
                const childrenWithData = await Promise.all(
                    children.map(async (child) => {
                        const ageInMonths = calculateAge(child.birthDate)
                        const latestGrowth = getLatestRecord(child.id)

                        // Fetch upcoming immunizations
                        let upcomingImmunizations: Array<{
                            vaccineName: string
                            scheduledDate: Date
                            daysUntil: number
                        }> = []
                        try {
                            const immunizationResponse = await fetch(`/api/immunization/${child.id}/records`)
                            if (immunizationResponse.ok) {
                                const immunizationData = await immunizationResponse.json()
                                const records = immunizationData.records || []

                                upcomingImmunizations = records
                                    .filter((record: { status: string }) => record.status === 'SCHEDULED')
                                    .map((record: { scheduledDate: string; schedule: { vaccineName: string } }) => {
                                        const scheduledDate = new Date(record.scheduledDate)
                                        const now = new Date()
                                        const daysUntil = Math.ceil((scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

                                        return {
                                            vaccineName: record.schedule.vaccineName,
                                            scheduledDate,
                                            daysUntil
                                        }
                                    })
                                    .filter((imm: { daysUntil: number }) => imm.daysUntil >= 0 && imm.daysUntil <= 30)
                                    .sort((a: { daysUntil: number }, b: { daysUntil: number }) => a.daysUntil - b.daysUntil)
                                    .slice(0, 3)
                            }
                        } catch (error) {
                            console.error('Error fetching immunizations for child:', child.id, error)
                        }

                        return {
                            ...child,
                            ageInMonths,
                            latestGrowth: latestGrowth ? {
                                weight: latestGrowth.weight,
                                height: latestGrowth.height,
                                date: latestGrowth.date,
                                weightForAgeZScore: latestGrowth.weightForAgeZScore,
                                heightForAgeZScore: latestGrowth.heightForAgeZScore
                            } : undefined,
                            upcomingImmunizations
                        }
                    })
                )

                setChildrenData(childrenWithData)
            } catch (error) {
                console.error('Error fetching children data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchChildrenData()
    }, [children, getLatestRecord])

    if (children.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow-soft border border-neutral-200 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <PlusIcon className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Belum Ada Anak Terdaftar
                </h3>
                <p className="text-neutral-600 mb-6">
                    Tambahkan profil anak Anda untuk mulai memantau tumbuh kembangnya
                </p>
                <button
                    onClick={() => router.push('/children/add')}
                    className="btn btn-primary"
                >
                    Tambah Anak Pertama
                </button>
            </div>
        )
    }

    const currentChild = selectedChild || children[0]
    const currentChildData = childrenData.find(c => c.id === currentChild?.id)

    if (isLoading || !currentChildData) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow-soft border border-neutral-200">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-32 bg-gray-200 rounded-xl"></div>
                        <div className="h-32 bg-gray-200 rounded-xl"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>

            {/* Child Selector */}
            {children.length > 1 && (
                <div className="mb-6 relative z-10">
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center justify-between w-full sm:w-auto min-w-[200px] px-4 py-3 bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 rounded-2xl text-orange-700 font-medium hover:from-orange-100 hover:to-pink-100 transition-all duration-300 shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-orange-200 rounded-xl flex items-center justify-center">
                                    <span className="text-sm">👶</span>
                                </div>
                                <span className="truncate">{currentChild?.name}</span>
                            </div>
                            <ChevronDownIcon className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-full sm:w-auto min-w-[200px] bg-white border border-gray-200 rounded-2xl shadow-xl z-[60] overflow-hidden">
                                {children.map((child) => (
                                    <button
                                        key={child.id}
                                        onClick={() => {
                                            setSelectedChild(child)
                                            setIsDropdownOpen(false)
                                        }}
                                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${child.id === currentChild?.id ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                                            }`}
                                    >
                                        <div className="w-8 h-8 bg-orange-200 rounded-xl flex items-center justify-center">
                                            <span className="text-sm">👶</span>
                                        </div>
                                        <span className="truncate">{child.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Child Info Header */}
            <div className="mb-6 relative z-10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-pink-200 rounded-2xl flex items-center justify-center shadow-sm">
                        <span className="text-2xl">
                            {currentChildData.gender === 'MALE' ? '👦' : '👧'}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            {currentChildData.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {currentChildData.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'} • {formatAge(currentChildData.ageInMonths)} • {currentChildData.relationship}
                        </p>
                    </div>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                {/* Latest Growth */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                            <span className="text-lg">📊</span>
                        </div>
                        <h3 className="font-semibold text-blue-800">Pertumbuhan Terakhir</h3>
                    </div>
                    {currentChildData.latestGrowth ? (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm text-secondary-600">Berat Badan</span>
                                <div className="text-right">
                                    <span className="font-medium text-secondary-800 text-sm sm:text-base">
                                        {currentChildData.latestGrowth.weight} kg
                                    </span>
                                    <span className={`block text-xs ${getGrowthStatus(currentChildData.latestGrowth.weightForAgeZScore).color}`}>
                                        {getGrowthStatus(currentChildData.latestGrowth.weightForAgeZScore).status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm text-secondary-600">Tinggi Badan</span>
                                <div className="text-right">
                                    <span className="font-medium text-secondary-800 text-sm sm:text-base">
                                        {currentChildData.latestGrowth.height} cm
                                    </span>
                                    <span className={`block text-xs ${getGrowthStatus(currentChildData.latestGrowth.heightForAgeZScore).color}`}>
                                        {getGrowthStatus(currentChildData.latestGrowth.heightForAgeZScore).status}
                                    </span>
                                </div>
                            </div>
                            <div className="text-xs text-blue-600 mt-3 pt-3 border-t border-blue-200 bg-white bg-opacity-50 rounded-lg px-3 py-2">
                                Terakhir diukur: {new Date(currentChildData.latestGrowth.date).toLocaleDateString('id-ID')}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">📈</span>
                            </div>
                            <p className="text-blue-700 text-sm mb-4">Belum ada data pertumbuhan</p>
                            <button
                                onClick={() => router.push('/growth')}
                                className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium"
                            >
                                Tambah Data
                            </button>
                        </div>
                    )}
                </div>

                {/* Upcoming Immunizations */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                            <span className="text-lg">💉</span>
                        </div>
                        <h3 className="font-semibold text-green-800">Imunisasi Mendatang</h3>
                    </div>
                    {currentChildData.upcomingImmunizations.length > 0 ? (
                        <div className="space-y-2">
                            {currentChildData.upcomingImmunizations.map((immunization, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-white bg-opacity-50 rounded-xl">
                                    <span className="text-sm text-green-700 font-medium truncate pr-2">{immunization.vaccineName}</span>
                                    <span className="text-xs bg-green-200 text-green-800 px-3 py-1 rounded-full flex-shrink-0 font-medium">
                                        {immunization.daysUntil === 0 ? 'Hari ini' :
                                            immunization.daysUntil === 1 ? 'Besok' :
                                                `${immunization.daysUntil} hari`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">📅</span>
                            </div>
                            <p className="text-green-700 text-sm mb-4">Tidak ada jadwal dalam 30 hari</p>
                            <button
                                onClick={() => router.push('/immunization')}
                                className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors text-sm font-medium"
                            >
                                Lihat Jadwal
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}