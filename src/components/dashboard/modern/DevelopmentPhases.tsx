'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Child {
    id: string
    name: string
    birthDate: Date
}

interface DevelopmentPhasesProps {
    child?: Child
}

interface Phase {
    id: string
    name: string
    description: string
    ageRange: string
    icon: string
    status: 'completed' | 'current' | 'upcoming'
    week?: number
    totalWeeks?: number
}

export function DevelopmentPhases({ child }: DevelopmentPhasesProps) {
    const [phases, setPhases] = useState<Phase[]>([])
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)

    const calculateAge = (birthDate: Date) => {
        const now = new Date()
        const birth = new Date(birthDate)
        const diffTime = Math.abs(now.getTime() - birth.getTime())
        const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
        return diffWeeks
    }

    useEffect(() => {
        if (!child) return

        const ageInWeeks = calculateAge(child.birthDate)

        const developmentPhases: Phase[] = [
            {
                id: 'newborn',
                name: 'Phase I: Newborn Welcome',
                description: 'Basic reflexes and adaptation to the world',
                ageRange: 'Starts at: Week 0',
                icon: '👶',
                status: ageInWeeks > 8 ? 'completed' : 'current',
                week: Math.min(ageInWeeks + 1, 8),
                totalWeeks: 8
            },
            {
                id: 'sensory',
                name: 'Phase I: Sensory awakening',
                description: 'Development of senses and awareness',
                ageRange: 'Starts at: Week 8',
                icon: '👁️',
                status: ageInWeeks > 16 ? 'completed' : ageInWeeks >= 8 ? 'current' : 'upcoming',
                week: ageInWeeks >= 8 ? Math.min(ageInWeeks - 7, 8) : undefined,
                totalWeeks: 8
            },
            {
                id: 'motor',
                name: 'Phase I: Motor development',
                description: 'Physical movement and coordination',
                ageRange: 'Starts at: Week 16',
                icon: '🤸',
                status: ageInWeeks > 24 ? 'completed' : ageInWeeks >= 16 ? 'current' : 'upcoming',
                week: ageInWeeks >= 16 ? Math.min(ageInWeeks - 15, 8) : undefined,
                totalWeeks: 8
            },
            {
                id: 'social',
                name: 'Phase I: Social interaction',
                description: 'Learning to interact with others',
                ageRange: 'Starts at: Week 24',
                icon: '👥',
                status: ageInWeeks > 32 ? 'completed' : ageInWeeks >= 24 ? 'current' : 'upcoming',
                week: ageInWeeks >= 24 ? Math.min(ageInWeeks - 23, 8) : undefined,
                totalWeeks: 8
            },
            {
                id: 'cognitive',
                name: 'Phase I: Cognitive growth',
                description: 'Mental development and learning',
                ageRange: 'Starts at: Week 32',
                icon: '🧠',
                status: ageInWeeks >= 32 ? 'current' : 'upcoming',
                week: ageInWeeks >= 32 ? Math.min(ageInWeeks - 31, 8) : undefined,
                totalWeeks: 8
            }
        ]

        setPhases(developmentPhases)

        // Find current phase index
        const currentIndex = developmentPhases.findIndex(phase => phase.status === 'current')
        setCurrentPhaseIndex(currentIndex >= 0 ? currentIndex : 0)
    }, [child])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'current':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'upcoming':
                return 'bg-gray-100 text-gray-600 border-gray-200'
            default:
                return 'bg-gray-100 text-gray-600 border-gray-200'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )
            case 'current':
                return (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                )
            case 'upcoming':
                return (
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                )
            default:
                return null
        }
    }

    if (!child) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="text-center py-8">
                    <p className="text-gray-500">Pilih anak untuk melihat fase perkembangan</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Development Phases</h3>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Current Phase</span>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">
                            {currentPhaseIndex + 1}
                        </span>
                    </div>
                </div>
            </div>

            {/* Phases List */}
            <div className="space-y-4">
                {phases.map((phase, index) => (
                    <motion.div
                        key={phase.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 ${getStatusColor(phase.status)} ${phase.status === 'current' ? 'ring-2 ring-blue-200 ring-opacity-50' : ''
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            {/* Phase Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                                    {phase.icon}
                                </div>
                            </div>

                            {/* Phase Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-semibold text-gray-900 truncate">
                                        {phase.name}
                                    </h4>
                                    {getStatusIcon(phase.status)}
                                </div>

                                <p className="text-sm text-gray-600 mb-2">
                                    {phase.description}
                                </p>

                                <p className="text-xs text-gray-500 mb-3">
                                    {phase.ageRange}
                                </p>

                                {/* Progress Bar for Current Phase */}
                                {phase.status === 'current' && phase.week && phase.totalWeeks && (
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium text-gray-700">
                                                Week {phase.week} of {phase.totalWeeks}
                                            </span>
                                            <span className="text-xs text-gray-600">
                                                {Math.round((phase.week / phase.totalWeeks) * 100)}%
                                            </span>
                                        </div>
                                        <div className="bg-white bg-opacity-50 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${(phase.week / phase.totalWeeks) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Overall Progress */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Overall Development</span>
                    <span className="text-sm text-gray-600">
                        {Math.round(((currentPhaseIndex + 1) / phases.length) * 100)}%
                    </span>
                </div>
                <div className="bg-white rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-blue-400 to-indigo-400 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${((currentPhaseIndex + 1) / phases.length) * 100}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                    {child.name} is progressing well through their development phases
                </p>
            </div>
        </div>
    )
}