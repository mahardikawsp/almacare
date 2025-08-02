'use client'

import { ReactNode } from 'react'
import { usePWA } from '@/hooks/usePWA'
import { SplashScreen } from '@/components/splash/SplashScreen'

interface PWAProviderProps {
    children: ReactNode
}

export function PWAProvider({ children }: PWAProviderProps) {
    const { showSplash, hideSplash, isInstalled } = usePWA()

    // Show splash screen for installed PWA
    if (showSplash && isInstalled) {
        return <SplashScreen onComplete={hideSplash} />
    }

    return <>{children}</>
}