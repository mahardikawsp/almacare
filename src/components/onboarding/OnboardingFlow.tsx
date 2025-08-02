'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
    HeartIcon,
    ChartBarIcon,
    CalendarIcon,
    BookOpenIcon,
    CheckIcon,
    ArrowRightIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface OnboardingStep {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    content: React.ReactNode
}

interface OnboardingFlowProps {
    onComplete: () => void
    onSkip?: () => void
}

const onboardingSteps: OnboardingStep[] = [
    {
        id: 'welcome',
        title: 'Selamat Datang di BayiCare',
        description: 'Aplikasi terpercaya untuk memantau tumbuh kembang si kecil',
        icon: <HeartIcon className="w-8 h-8" />,
        content: (
            <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-6">
                    <HeartIcon className="w-12 h-12 text-primary-500" />
                </div>
                <p className="text-neutral-600">
                    BayiCare membantu Anda memantau pertumbuhan, imunisasi, dan nutrisi anak
                    berdasarkan standar WHO dan Kementerian Kesehatan RI.
                </p>
            </div>
        )
    },
    {
        id: 'growth-tracking',
        title: 'Pantau Pertumbuhan',
        description: 'Catat berat, tinggi, dan lingkar kepala anak secara rutin',
        icon: <ChartBarIcon className="w-8 h-8" />,
        content: (
            <div className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <ChartBarIcon className="w-10 h-10 text-green-600" />
                </div>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                        <span className="text-sm">Hitung Z-score berdasarkan standar WHO</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                        <span className="text-sm">Grafik pertumbuhan yang mudah dipahami</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                        <span className="text-sm">Peringatan dini jika ada masalah</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'immunization',
        title: 'Jadwal Imunisasi',
        description: 'Jangan lewatkan jadwal vaksin penting untuk si kecil',
        icon: <CalendarIcon className="w-8 h-8" />,
        content: (
            <div className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon className="w-10 h-10 text-blue-600" />
                </div>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <CheckIcon className="w-5 h-5 text-blue-500" />
                        <span className="text-sm">Jadwal sesuai standar Kemenkes RI</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <CheckIcon className="w-5 h-5 text-blue-500" />
                        <span className="text-sm">Pengingat otomatis sebelum jadwal</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <CheckIcon className="w-5 h-5 text-blue-500" />
                        <span className="text-sm">Riwayat imunisasi lengkap</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'mpasi',
        title: 'Menu MPASI',
        description: 'Resep dan jadwal makan sehat untuk anak 6+ bulan',
        icon: <BookOpenIcon className="w-8 h-8" />,
        content: (
            <div className="space-y-4">
                <div className="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpenIcon className="w-10 h-10 text-orange-600" />
                </div>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <CheckIcon className="w-5 h-5 text-orange-500" />
                        <span className="text-sm">Resep sesuai usia dan tekstur</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <CheckIcon className="w-5 h-5 text-orange-500" />
                        <span className="text-sm">Informasi nilai gizi lengkap</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <CheckIcon className="w-5 h-5 text-orange-500" />
                        <span className="text-sm">Jadwal makan harian</span>
                    </div>
                </div>
            </div>
        )
    }
]

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    const handleNext = () => {
        if (currentStep < onboardingSteps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            handleComplete()
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleComplete = () => {
        setIsVisible(false)
        setTimeout(() => {
            onComplete()
        }, 300)
    }

    const handleSkip = () => {
        if (onSkip) {
            setIsVisible(false)
            setTimeout(() => {
                onSkip()
            }, 300)
        }
    }

    const currentStepData = onboardingSteps[currentStep]
    const progress = ((currentStep + 1) / onboardingSteps.length) * 100

    if (!isVisible) {
        return null
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={cn(
                'w-full max-w-md transition-all duration-300',
                isVisible ? 'animate-scale-in' : 'animate-scale-out'
            )}>
                <Card className="p-6">
                    {/* Progress bar */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-neutral-600">
                                Langkah {currentStep + 1} dari {onboardingSteps.length}
                            </span>
                            {onSkip && (
                                <button
                                    onClick={handleSkip}
                                    className="text-sm text-neutral-500 hover:text-neutral-700"
                                >
                                    Lewati
                                </button>
                            )}
                        </div>
                        <div className="w-full bg-primary-100 rounded-full h-2">
                            <div
                                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Step content */}
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-primary-900 mb-2">
                            {currentStepData.title}
                        </h2>
                        <p className="text-neutral-600 mb-6">
                            {currentStepData.description}
                        </p>

                        <div className="animate-fade-in">
                            {currentStepData.content}
                        </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex justify-between items-center">
                        <Button
                            variant="ghost"
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            icon={<ArrowLeftIcon />}
                            iconPosition="left"
                        >
                            Sebelumnya
                        </Button>

                        <div className="flex space-x-1">
                            {onboardingSteps.map((_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        'w-2 h-2 rounded-full transition-colors',
                                        index === currentStep ? 'bg-primary-500' : 'bg-primary-200'
                                    )}
                                />
                            ))}
                        </div>

                        <Button
                            onClick={handleNext}
                            icon={currentStep === onboardingSteps.length - 1 ? <CheckIcon /> : <ArrowRightIcon />}
                            iconPosition="right"
                        >
                            {currentStep === onboardingSteps.length - 1 ? 'Mulai' : 'Selanjutnya'}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

// Hook to manage onboarding state
export function useOnboarding() {
    const [showOnboarding, setShowOnboarding] = useState(false)

    useEffect(() => {
        // Check if user has completed onboarding
        const hasCompletedOnboarding = localStorage.getItem('bayicare-onboarding-completed')
        if (!hasCompletedOnboarding) {
            setShowOnboarding(true)
        }
    }, [])

    const completeOnboarding = () => {
        localStorage.setItem('bayicare-onboarding-completed', 'true')
        setShowOnboarding(false)
    }

    const skipOnboarding = () => {
        localStorage.setItem('bayicare-onboarding-completed', 'true')
        setShowOnboarding(false)
    }

    const resetOnboarding = () => {
        localStorage.removeItem('bayicare-onboarding-completed')
        setShowOnboarding(true)
    }

    return {
        showOnboarding,
        completeOnboarding,
        skipOnboarding,
        resetOnboarding,
    }
}