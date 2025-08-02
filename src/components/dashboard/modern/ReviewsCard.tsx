'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Review {
    id: string
    reviewer: string
    avatar?: string
    rating: number
    comment: string
    date: Date
    type: 'parent' | 'expert' | 'pediatrician'
}

export function ReviewsCard() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

    useEffect(() => {
        // Mock reviews data
        const mockReviews: Review[] = [
            {
                id: '1',
                reviewer: 'Mr. Alexander',
                rating: 5,
                comment: 'Aplikasi yang sangat membantu untuk memantau perkembangan anak. Interface yang user-friendly dan fitur yang lengkap.',
                date: new Date(),
                type: 'parent'
            },
            {
                id: '2',
                reviewer: 'Dr. Sarah',
                rating: 5,
                comment: 'Sebagai dokter anak, saya merekomendasikan aplikasi ini untuk para orang tua. Data yang akurat dan mudah dipahami.',
                date: new Date(),
                type: 'pediatrician'
            },
            {
                id: '3',
                reviewer: 'Mrs. Diana',
                rating: 4,
                comment: 'Sangat terbantu dengan reminder imunisasi dan tracking pertumbuhan. Anak saya jadi tidak terlewat jadwal vaksin.',
                date: new Date(),
                type: 'parent'
            }
        ]

        setReviews(mockReviews)
    }, [])

    const nextReview = () => {
        setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)
    }

    const prevReview = () => {
        setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'parent':
                return '👨‍👩‍👧‍👦'
            case 'expert':
                return '👩‍⚕️'
            case 'pediatrician':
                return '🩺'
            default:
                return '👤'
        }
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'parent':
                return 'Parent'
            case 'expert':
                return 'Expert'
            case 'pediatrician':
                return 'Pediatrician'
            default:
                return 'User'
        }
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <svg
                key={index}
                className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))
    }

    if (reviews.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-20 mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        )
    }

    const currentReview = reviews[currentReviewIndex]

    return (
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Reviews</h3>
                <div className="flex items-center gap-1">
                    <button
                        onClick={prevReview}
                        className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        disabled={reviews.length <= 1}
                    >
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextReview}
                        className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        disabled={reviews.length <= 1}
                    >
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <motion.div
                key={currentReview.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
            >
                {/* Reviewer Info */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">{getTypeIcon(currentReview.type)}</span>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                            {currentReview.reviewer}
                        </h4>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">
                                {getTypeLabel(currentReview.type)}
                            </span>
                            <div className="flex items-center gap-1">
                                {renderStars(currentReview.rating)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Review Comment */}
                <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-sm text-gray-700 leading-relaxed">
                        "{currentReview.comment}"
                    </p>
                </div>

                {/* Review Date */}
                <div className="text-xs text-gray-500 text-center">
                    {currentReview.date.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}
                </div>
            </motion.div>

            {/* Pagination Dots */}
            {reviews.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    {reviews.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentReviewIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentReviewIndex
                                    ? 'bg-blue-500 w-4'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Overall Rating */}
            <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Overall Rating</span>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            {renderStars(5)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                            4.8/5
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}