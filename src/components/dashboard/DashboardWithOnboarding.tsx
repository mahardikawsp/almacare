'use client'

import React from 'react'
import { OnboardingFlow, useOnboarding } from '@/components/onboarding/OnboardingFlow'
import { DashboardSkeleton } from '@/components/ui/Skeleton'

interface DashboardWithOnboardingProps {
    children: React.ReactNode
}

export function DashboardWithOnboarding({ children }: DashboardWithOnboardingProps) {
    const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding()
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        // Simulate initial loading
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    if (isLoading) {
        return <DashboardSkeleton />
    }

    return (
        <>
            {children}
            {showOnboarding && (
                <OnboardingFlow
                    onComplete={completeOnboarding}
                    onSkip={skipOnboarding}
                />
            )}
        </>
    )
}