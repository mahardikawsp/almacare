'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useChildStore } from '@/stores/childStore'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// Modern Dashboard Components
import { ChildProfileCard } from './modern/ChildProfileCard'
import { AchievementCategories } from './modern/AchievementCategories'
import { DevelopmentPhases } from './modern/DevelopmentPhases'
import { UpcomingEvents } from './modern/UpcomingEvents'
import { FeaturedContent } from './modern/FeaturedContent'
import { ModernStats } from './modern/ModernStats'
import { GrowthChart } from './modern/GrowthChart'
import { ReviewsCard } from './modern/ReviewsCard'
import { PhaseDetailCard } from './modern/PhaseDetailCard'
import { MilestoneTracker } from './modern/MilestoneTracker'

interface ModernDashboardProps {
    className?: string
}

export function ModernDashboard({ className = '' }: ModernDashboardProps) {
    const { data: session } = useSession()
    const { children, selectedChild } = useChildStore()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    const currentChild = selectedChild || children[0]

    useEffect(() => {
        // Simulate loading for smooth animation
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    if (isLoading) {
        return (
            <div className={`space-y-6 ${className}`}>
                {/* Loading skeleton */}
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-6"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="h-48 bg-gray-200 rounded-2xl"></div>
                            <div className="h-64 bg-gray-200 rounded-2xl"></div>
                        </div>
                        <div className="space-y-6">
                            <div className="h-32 bg-gray-200 rounded-2xl"></div>
                            <div className="h-48 bg-gray-200 rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (children.length === 0) {
        return (
            <div className={`${className}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">👶</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Selamat datang di BayiCare!
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Mulai perjalanan memantau tumbuh kembang anak Anda dengan menambahkan profil anak pertama.
                    </p>
                    <button
                        onClick={() => router.push('/children/add')}
                        className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Tambah Anak Pertama
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Your Wiz Kids
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Pantau perkembangan anak dengan mudah
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold">👤</span>
                    </div>
                </div>
            </motion.div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Child Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <ChildProfileCard child={currentChild} />
                    </motion.div>

                    {/* Achievement Categories */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <AchievementCategories child={currentChild} />
                    </motion.div>

                    {/* Development Phases */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <DevelopmentPhases child={currentChild} />
                    </motion.div>

                    {/* Growth Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <GrowthChart child={currentChild} />
                    </motion.div>

                    {/* Phase Detail */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <PhaseDetailCard child={currentChild} />
                    </motion.div>

                    {/* Milestone Tracker */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <MilestoneTracker child={currentChild} />
                    </motion.div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Modern Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <ModernStats />
                    </motion.div>

                    {/* Upcoming Events */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <UpcomingEvents child={currentChild} />
                    </motion.div>

                    {/* Reviews */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <ReviewsCard />
                    </motion.div>

                    {/* Featured Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <FeaturedContent />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}