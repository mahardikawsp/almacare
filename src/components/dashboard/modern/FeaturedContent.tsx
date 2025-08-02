'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface FeaturedItem {
    id: string
    title: string
    description: string
    type: 'ebook' | 'article' | 'video' | 'guide'
    image?: string
    color: string
    bgColor: string
    readTime?: string
    isNew?: boolean
}

export function FeaturedContent() {
    const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        // Mock featured content data
        const mockItems: FeaturedItem[] = [
            {
                id: '1',
                title: 'Understanding Baby Phases',
                description: 'Complete guide to your baby\'s development stages',
                type: 'ebook',
                color: 'green',
                bgColor: 'bg-green-50',
                readTime: '15 min read',
                isNew: true
            },
            {
                id: '2',
                title: 'First Latch Success',
                description: 'Tips for successful breastfeeding from day one',
                type: 'article',
                color: 'blue',
                bgColor: 'bg-blue-50',
                readTime: '8 min read'
            },
            {
                id: '3',
                title: 'Sleep Training Guide',
                description: 'Gentle methods to help your baby sleep better',
                type: 'guide',
                color: 'purple',
                bgColor: 'bg-purple-50',
                readTime: '12 min read'
            }
        ]

        setFeaturedItems(mockItems)
    }, [])

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'ebook':
                return '📚'
            case 'article':
                return '📄'
            case 'video':
                return '🎥'
            case 'guide':
                return '📋'
            default:
                return '📖'
        }
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'ebook':
                return 'eBook'
            case 'article':
                return 'Article'
            case 'video':
                return 'Video'
            case 'guide':
                return 'Guide'
            default:
                return 'Content'
        }
    }

    const nextItem = () => {
        setCurrentIndex((prev) => (prev + 1) % featuredItems.length)
    }

    const prevItem = () => {
        setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length)
    }

    if (featuredItems.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        )
    }

    const currentItem = featuredItems[currentIndex]

    return (
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Featured eBook</h3>
                <div className="flex items-center gap-1">
                    <button
                        onClick={prevItem}
                        className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        disabled={featuredItems.length <= 1}
                    >
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextItem}
                        className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        disabled={featuredItems.length <= 1}
                    >
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`${currentItem.bgColor} rounded-2xl p-4 relative overflow-hidden`}
            >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-20 rounded-full -translate-y-10 translate-x-10"></div>

                {/* New Badge */}
                {currentItem.isNew && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        New
                    </div>
                )}

                {/* Content */}
                <div className="relative z-10">
                    {/* Type and Icon */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-white bg-opacity-50 rounded-lg flex items-center justify-center">
                            <span className="text-lg">{getTypeIcon(currentItem.type)}</span>
                        </div>
                        <span className="text-xs font-medium text-gray-700 bg-white bg-opacity-50 px-2 py-1 rounded-full">
                            {getTypeLabel(currentItem.type)}
                        </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-gray-900 mb-2 leading-tight">
                        {currentItem.title}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                        {currentItem.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between">
                        {currentItem.readTime && (
                            <span className="text-xs text-gray-600 bg-white bg-opacity-50 px-2 py-1 rounded-full">
                                {currentItem.readTime}
                            </span>
                        )}

                        <button className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors flex items-center gap-1">
                            Read now
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Pagination Dots */}
            {featuredItems.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    {featuredItems.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'bg-gray-900 w-4'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Browse All */}
            <div className="mt-4 pt-3 border-t border-gray-100">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    Browse all content
                </button>
            </div>
        </div>
    )
}