'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Child {
    id: string
    name: string
    birthDate: Date
}

interface MilestoneTrackerProps {
    child?: Child
}

interface Milestone {
    id: string
    title: string
    description: string
    expectedWeek: number
    achievedWeek?: number
    status: 'achieved' | 'current' | 'upcoming' | 'overdue'
    category: 'motor' | 'cognitive' | 'social' | 'language'
    icon: string
}

export function MilestoneTracker({ child }: MilestoneTrackerProps) {
    const [milestones, setMilestones] = useState<Milestone[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

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

        const mockMilestones: Milestone[] = [
            {
                id: '1',
                title: 'First Smile',
                description: 'Social smile in response to interaction',
                expectedWeek: 6,
                achievedWeek: 5,
                status: ageInWeeks >= 5 ? 'achieved' : ageInWeeks >= 4 ? 'current' : 'upcoming',
                category: 'social',
                icon: '😊'
            },
            {
                id: '2',
                title: 'Head Control',
                description: 'Holds head up during tummy time',
                expectedWeek: 8,
                achievedWeek: ageInWeeks >= 8 ? 8 : undefined,
                status: ageInWeeks >= 8 ? 'achieved' : ageInWeeks >= 6 ? 'current' : 'upcoming',
                category: 'motor',
                icon: '💪'
            },
            {
                id: '3',
                title: 'Follows Objects',
                description: 'Tracks moving objects with eyes',
                expectedWeek: 10,
                status: ageInWeeks >= 10 ? 'achieved' : ageInWeeks >= 8 ? 'current' : 'upcoming',
                category: 'cognitive',
                icon: '👁️'
            },
            {
                id: '4',
                title: 'Cooing Sounds',
                description: 'Makes cooing and gurgling sounds',
                expectedWeek: 12,
                status: ageInWeeks >= 12 ? 'achieved' : ageInWeeks >= 10 ? 'current' : 'upcoming',
                category: 'language',
                icon: '🗣️'
            },
            {
                id: '5',
                title: 'Reaches for Objects',
                description: 'Intentionally reaches for toys',
                expectedWeek: 16,
                status: ageInWeeks >= 16 ? 'achieved' : ageInWeeks >= 14 ? 'current' : 'upcoming',
                category: 'motor',
                icon: '🤲'
            }
        ]

        setMilestones(mockMilestones)
    }, [child])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'achieved':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'current':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'upcoming':
                return 'bg-gray-100 text-gray-600 border-gray-200'
            case 'overdue':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-600 border-gray-200'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'achieved':
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
            case 'overdue':
                return (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                        </svg>
                    </div>
                )
            default:
                return null
        }
    }

    const categories = [
        { id: 'all', label: 'All', icon: '📋' },
        { id: 'motor', label: 'Motor', icon: '💪' },
        { id: 'cognitive', label: 'Cognitive', icon: '🧠' },
        { id: 'social', label: 'Social', icon: '👥' },
        { id: 'language', label: 'Language', icon: '🗣️' }
    ]

    const filteredMilestones = selectedCategory === 'all'
        ? milestones
        : milestones.filter(m => m.category === selectedCategory)

    const achievedCount = milestones.filter(m => m.status === 'achieved').length
    const totalCount = milestones.length

    if (!child) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="text-center py-8">
                    <p className="text-gray-500">Select a child to view milestones</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Milestone Tracker</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {achievedCount} of {totalCount} milestones achieved
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                        {Math.round((achievedCount / totalCount) * 100)}%
                    </div>
                    <div className="text-xs text-gray-600">Complete</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-green-400 to-emerald-400 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${(achievedCount / totalCount) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${selectedCategory === category.id
                                ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                            }`}
                    >
                        <span>{category.icon}</span>
                        {category.label}
                    </button>
                ))}
            </div>

            {/* Milestones List */}
            <div className="space-y-3">
                {filteredMilestones.map((milestone, index) => (
                    <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 ${getStatusColor(milestone.status)}`}
                    >
                        <div className="flex items-start gap-4">
                            {/* Milestone Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                                    {milestone.icon}
                                </div>
                            </div>

                            {/* Milestone Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-semibold text-gray-900">
                                        {milestone.title}
                                    </h4>
                                    {getStatusIcon(milestone.status)}
                                </div>

                                <p className="text-sm text-gray-600 mb-2">
                                    {milestone.description}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>Expected: Week {milestone.expectedWeek}</span>
                                    {milestone.achievedWeek && (
                                        <span className="text-green-600 font-medium">
                                            Achieved: Week {milestone.achievedWeek}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-gray-100">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-2xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                    View All Milestones
                </button>
            </div>
        </div>
    )
}