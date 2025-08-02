'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useChildStore } from '@/stores/childStore'
import { useGrowthStore } from '@/stores/growthStore'
import { QuickStatsGrid } from './QuickStatsGrid'

interface Child {
    id: string
    name: string
    gender: 'MALE' | 'FEMALE'
    birthDate: Date
    relationship: string
}

interface ChildProfileCardProps {
    child?: Child
}

export function ChildProfileCard({ child }: ChildProfileCardProps) {
    const { children, selectedChild, setSelectedChild } = useChildStore()
    const { getLatestRecord } = useGrowthStore()
    const [currentPhase, setCurrentPhase] = useState('Sensory awakening')
    const [weekInfo, setWeekInfo] = useState({ current: 5, total: 8 })
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const calculateAge = (birthDate: Date) => {
        const now = new Date()
        const birth = new Date(birthDate)
        const diffTime = Math.abs(now.getTime() - birth.getTime())
        const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
        const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44))
        return { weeks: diffWeeks, months: diffMonths }
    }

    const getDevelopmentPhase = (ageInWeeks: number) => {
        if (ageInWeeks < 8) return { phase: 'Newborn Welcome', week: ageInWeeks + 1, total: 8 }
        if (ageInWeeks < 16) return { phase: 'Sensory awakening', week: ageInWeeks - 7, total: 8 }
        if (ageInWeeks < 24) return { phase: 'Motor development', week: ageInWeeks - 15, total: 8 }
        if (ageInWeeks < 32) return { phase: 'Social interaction', week: ageInWeeks - 23, total: 8 }
        return { phase: 'Advanced learning', week: Math.min(ageInWeeks - 31, 8), total: 8 }
    }

    useEffect(() => {
        if (child) {
            const age = calculateAge(child.birthDate)
            const phaseInfo = getDevelopmentPhase(age.weeks)
            setCurrentPhase(phaseInfo.phase)
            setWeekInfo({ current: phaseInfo.week, total: phaseInfo.total })
        }
    }, [child])

    if (!child) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="text-center py-8">
                    <p className="text-gray-500">Pilih anak untuk melihat profil</p>
                </div>
            </div>
        )
    }

    const age = calculateAge(child.birthDate)
    const latestGrowth = getLatestRecord(child.id)

    return (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>

            {/* Header with Child Selector */}
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                    {/* Child Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-pink-200 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl">
                            {child.gender === 'MALE' ? '👦' : '👧'}
                        </span>
                    </div>

                    {/* Child Info */}
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-gray-900">{child.name}</h2>
                            {children.length > 1 && (
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <p className="text-gray-600 text-sm">
                            {age.months} bulan • {child.relationship}
                        </p>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">Active</span>
                </div>
            </div>

            {/* Child Selector Dropdown */}
            {isDropdownOpen && children.length > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-20 left-6 right-6 bg-white rounded-2xl shadow-xl border border-gray-200 z-20 overflow-hidden"
                >
                    {children.map((childOption) => (
                        <button
                            key={childOption.id}
                            onClick={() => {
                                setSelectedChild(childOption)
                                setIsDropdownOpen(false)
                            }}
                            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${childOption.id === child.id ? 'bg-orange-50' : ''
                                }`}
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-pink-200 rounded-xl flex items-center justify-center">
                                <span className="text-lg">
                                    {childOption.gender === 'MALE' ? '👦' : '👧'}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{childOption.name}</p>
                                <p className="text-sm text-gray-600">{childOption.relationship}</p>
                            </div>
                        </button>
                    ))}
                </motion.div>
            )}

            {/* Current Phase */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 border border-green-100">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-green-800">Current Phase</h3>
                    <span className="text-sm text-green-600">Week {weekInfo.current}</span>
                </div>

                <h4 className="text-lg font-bold text-green-900 mb-2">{currentPhase}</h4>

                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 bg-green-100 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(weekInfo.current / weekInfo.total) * 100}%` }}
                        ></div>
                    </div>
                    <span className="text-sm text-green-600 font-medium">
                        {weekInfo.current}/{weekInfo.total}
                    </span>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <QuickStatsGrid />
        </div>
    )
}