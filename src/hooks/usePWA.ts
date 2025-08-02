'use client'

import { useEffect, useState } from 'react'

export function usePWA() {
    const [isInstalled, setIsInstalled] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)
    const [showSplash, setShowSplash] = useState(false)

    useEffect(() => {
        // Check if running as installed PWA
        const checkPWAStatus = () => {
            // Check if running in standalone mode (installed PWA)
            const standalone = window.matchMedia('(display-mode: standalone)').matches

            // Check if running in fullscreen mode (some PWAs)
            const fullscreen = window.matchMedia('(display-mode: fullscreen)').matches

            // Check if running in minimal-ui mode
            const minimalUI = window.matchMedia('(display-mode: minimal-ui)').matches

            // Check for iOS standalone mode
            const iosStandalone = (window.navigator as any).standalone === true

            const isPWA = standalone || fullscreen || minimalUI || iosStandalone

            setIsStandalone(isPWA)
            setIsInstalled(isPWA)

            // Show splash screen only for installed PWA and first visit
            if (isPWA) {
                const hasShownSplash = sessionStorage.getItem('almacare-splash-shown')
                if (!hasShownSplash) {
                    setShowSplash(true)
                    sessionStorage.setItem('almacare-splash-shown', 'true')
                }
            }
        }

        checkPWAStatus()

        // Listen for display mode changes
        const mediaQuery = window.matchMedia('(display-mode: standalone)')
        mediaQuery.addEventListener('change', checkPWAStatus)

        return () => {
            mediaQuery.removeEventListener('change', checkPWAStatus)
        }
    }, [])

    const hideSplash = () => {
        setShowSplash(false)
    }

    return {
        isInstalled,
        isStandalone,
        showSplash,
        hideSplash
    }
}