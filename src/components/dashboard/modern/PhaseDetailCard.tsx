'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Child {
    id: string
    name: string
    birthDate: Date
}

interface PhaseDetailCardProps {
    child?: Child
}

interface PhaseDetail {
    id: string
    name: string
    description: string
    keyPeriod: string
    duration: string
    startWeek: number
    endWeek: number
    milestones: string[]
    tips: string[]
    whatToExpect: string[]
}

export function PhaseDetailCard({ child }: PhaseDetailCardProps) {
    const [currentPhase, setCurrentPhase] = useState<PhaseDetail | null>(null)
    const [isExpanded, setIsExpanded] = useState(false)

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

        // Mock phase data based on age
        const phases: PhaseDetail[] = [
            {
                id: 'sensory-awakening',
                name: 'Sensory Awakening',
                description: 'Your baby is developing their senses and becoming more aware of their surroundings.',
                keyPeriod: 'Key Period',
                duration: 'Starts at: Week 8',
                startWeek: 8,
                endWeek: 16,
                milestones: [
                    'Follows objects with eyes',
                    'Responds to sounds',
                    'Shows social smiles',
                    'Begins to coo and make sounds'
                ],
                tips: [
                    'Talk and sing to your baby regularly',
                    'Provide colorful toys and objects',
                    'Make eye contact during feeding',
                    'Play gentle music'
                ],
                whatToExpected: [
                    'Increased alertness during wake periods',
                    'More responsive to voices and faces',
                    'Beginning of sleep pattern regulation',
                    'First social interactions'
                ]
            },
            {
                id: 'motor-development',
                name: 'Motor Development',
                description: 'Physical movement and coordination skills are rapidly developing.',
                keyPeriod: 'Key Period',
                duration: 'Starts at: Week 16',
                startWeek: 16,
                endWeek: 24,
                milestones: [
                    'Holds head up during tummy time',
                    'Reaches for and grasps objects',
                    'Rolls from tummy to back',
                    'Sits with support'
                ],
                tips: [
                    'Provide plenty of tummy time',
                    'Offer safe objects to grasp',
                    'Encourage reaching and stretching',
                    'Support sitting practice'
                ],
                whatToExpected: [
                    'Stronger neck and back muscles',
                    'Better hand-eye coordination',
                    'More purposeful movements',
                    'Increased physical activity'
                ]
            }
        ]

        // Find current phase based on age
        const phase = phases.find(p => ageInWeeks >= p.startWeek && ageInWeeks < p.endWeek) || phases[0]
        setCurrentPhase(phase)
    }, [child])

    if (!child || !currentPhase) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="text-center py-8">
                    <p className="text-gray-500">Select a child to view phase details</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Phase I</h3>
                    <p className="text-sm text-gray-600 mt-1">{currentPhase.keyPeriod}</p>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                    <svg
                        className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Phase Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 border border-green-100">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🌱</span>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-green-900 mb-2">
                            {currentPhase.name}
                        </h4>
                        <p className="text-sm text-green-700 mb-3">
                            {currentPhase.description}
                        </p>
                        <div className="text-xs text-green-600 bg-green-100 bg-opacity-50 px-3 py-1 rounded-full inline-block">
                            {currentPhase.duration}
                        </div>
                    </div>
                </div>
            </div>

            {/* Expandable Content */}
            <motion.div
                initial={false}
                animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <div className="space-y-6">
                    {/* What to Expect */}
                    <div>
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="text-lg">👀</span>
                            What to Expect in this phase
                        </h5>
                        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                            <ul className="space-y-2">
                                {currentPhase.whatToExpected.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Milestones */}
                    <div>
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="text-lg">🎯</span>
                            Key Milestones
                        </h5>
                        <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                            <ul className="space-y-2">
                                {currentPhase.milestones.map((milestone, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-purple-800">
                                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                        {milestone}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Encouragement Tips */}
                    <div>
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="text-lg">💡</span>
                            Encouragement Tips
                        </h5>
                        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                            <ul className="space-y-2">
                                {currentPhase.tips.map((tip, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-orange-800">
                                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-2xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm">
                    Track Progress
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-2xl font-medium hover:bg-gray-200 transition-colors text-sm">
                    Learn More
                </button>
            </div>
        </div>
    )
}