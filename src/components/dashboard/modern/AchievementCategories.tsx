'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Child {
    id: string
    name: string
    birthDate: Date
}

interface AchievementCategoriesProps {
    child?: Child
}

interface Achievement {
    id: string
    name: string
    icon: string
    progress: number
    total: number
    color: string
    bgColor: string
    description: string
}

export function AchievementCategories({ child }: AchievementCategoriesProps) {
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    useEffect(() => {
        // Mock achievement data based on child's age
        const mockAchievements: Achievement[] = [
            {
                id: 'sleep',
                name: 'Sleep',
                icon: '😴',
                progress: 8,
                total: 10,
                color: 'blue',
                bgColor: 'bg-blue-50',
                description: 'Sleep patterns and quality'
            },
            {
                id: 'eat',
                name: 'Eat',
                icon: '🍼',
                progress: 6,
                total: 8,
                color: 'green',
                bgColor: 'bg-green-50',
                description: 'Feeding and nutrition'
            },
            {
                id: 'play',
                name: 'Play',
                icon: '🧸',
                progress: 5,
                total: 7,
                color: 'purple',
                bgColor: 'bg-purple-50',
                description: 'Play and interaction'
            },
            {
                id: 'motor',
                name: 'Motor',
                icon: '🤸',
                progress: 4,
                total: 6,
                color: 'orange',
                bgColor: 'bg-orange-50',
                description: 'Motor development'
            },
            {
                id: 'social',
                name: 'Social',
                icon: '👥',
                progress: 7,
                total: 9,
                color: 'pink',
                bgColor: 'bg-pink-50',
                description: 'Social interaction'
            },
            {
                id: 'cognitive',
                name: 'Cognitive',
                icon: '🧠',
                progress: 3,
                total: 5,
                color: 'indigo',
                bgColor: 'bg-indigo-50',
                description: 'Cognitive development'
            },
            {
                id: 'language',
                name: 'Language',
                icon: '🗣️',
                progress: 2,
                total: 4,
                color: 'teal',
                bgColor: 'bg-teal-50',
                description: 'Language development'
            },
            {
                id: 'sensory',
                name: 'Sensory',
                icon: '👁️',
                progress: 6,
                total: 8,
                color: 'yellow',
                bgColor: 'bg-yellow-50',
                description: 'Sensory development'
            },
            {
                id: 'emotional',
                name: 'Emotional',
                icon: '❤️',
                progress: 5,
                total: 7,
                color: 'red',
                bgColor: 'bg-red-50',
                description: 'Emotional development'
            }
        ]

        setAchievements(mockAchievements)
    }, [child])

    const getProgressPercentage = (progress: number, total: number) => {
        return Math.round((progress / total) * 100)
    }

    const getProgressColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-600'
        if (percentage >= 60) return 'text-yellow-600'
        return 'text-orange-600'
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Achievements</h3>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Achievements Unlocked</span>
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-orange-600">
                            {achievements.filter(a => a.progress === a.total).length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Achievement Categories Grid */}
            <div className="grid grid-cols-3 gap-4">
                {achievements.map((achievement, index) => {
                    const percentage = getProgressPercentage(achievement.progress, achievement.total)
                    const isCompleted = achievement.progress === achievement.total

                    return (
                        <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`${achievement.bgColor} rounded-2xl p-4 cursor-pointer hover:scale-105 transition-all duration-300 relative overflow-hidden`}
                            onClick={() => setSelectedCategory(selectedCategory === achievement.id ? null : achievement.id)}
                        >
                            {/* Completion Badge */}
                            {isCompleted && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}

                            {/* Icon */}
                            <div className="text-2xl mb-3 text-center">
                                {achievement.icon}
                            </div>

                            {/* Name */}
                            <h4 className="font-semibold text-gray-900 text-center text-sm mb-2">
                                {achievement.name}
                            </h4>

                            {/* Progress */}
                            <div className="text-center">
                                <div className={`text-lg font-bold ${getProgressColor(percentage)}`}>
                                    {percentage}%
                                </div>
                                <div className="text-xs text-gray-600">
                                    {achievement.progress}/{achievement.total}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-3 bg-white bg-opacity-50 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-400' :
                                            percentage >= 60 ? 'bg-yellow-400' : 'bg-orange-400'
                                        }`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>

                            {/* Expanded Details */}
                            {selectedCategory === achievement.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-3 pt-3 border-t border-white border-opacity-50"
                                >
                                    <p className="text-xs text-gray-700 text-center">
                                        {achievement.description}
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    )
                })}
            </div>

            {/* Overall Progress */}
            <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border border-orange-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Overall Progress</span>
                    <span className="text-sm text-gray-600">
                        {Math.round(achievements.reduce((acc, curr) => acc + (curr.progress / curr.total), 0) / achievements.length * 100)}%
                    </span>
                </div>
                <div className="bg-white rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-orange-400 to-pink-400 h-3 rounded-full transition-all duration-1000"
                        style={{
                            width: `${Math.round(achievements.reduce((acc, curr) => acc + (curr.progress / curr.total), 0) / achievements.length * 100)}%`
                        }}
                    ></div>
                </div>
            </div>
        </div>
    )
}