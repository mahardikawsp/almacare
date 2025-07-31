'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
    interface Navigator {
        standalone?: boolean
    }
}

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [showPrompt, setShowPrompt] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)

    useEffect(() => {
        // Check if app is already installed
        const checkInstalled = () => {
            // Check if running in standalone mode (installed PWA)
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches
            // Check if running in PWA mode on iOS
            const isIOSPWA = window.navigator.standalone === true

            setIsInstalled(isStandalone || isIOSPWA)
        }

        checkInstalled()

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)

            // Check if user has dismissed the prompt before
            const dismissed = localStorage.getItem('pwa-install-dismissed')
            const dismissedTime = dismissed ? parseInt(dismissed) : 0
            const now = Date.now()

            // Show prompt if not dismissed or dismissed more than 7 days ago
            if (!dismissed || (now - dismissedTime) > 7 * 24 * 60 * 60 * 1000) {
                setShowPrompt(true)
            }
        }

        // Listen for app installed event
        const handleAppInstalled = () => {
            setIsInstalled(true)
            setShowPrompt(false)
            setDeferredPrompt(null)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.addEventListener('appinstalled', handleAppInstalled)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('appinstalled', handleAppInstalled)
        }
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return

        try {
            await deferredPrompt.prompt()
            const choiceResult = await deferredPrompt.userChoice

            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt')
            } else {
                console.log('User dismissed the install prompt')
                // Remember dismissal
                localStorage.setItem('pwa-install-dismissed', Date.now().toString())
            }
        } catch (error) {
            console.error('Error showing install prompt:', error)
        }

        setDeferredPrompt(null)
        setShowPrompt(false)
    }

    const handleDismiss = () => {
        setShowPrompt(false)
        localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    }

    // Don't show if already installed or no prompt available
    if (isInstalled || !showPrompt || !deferredPrompt) {
        return null
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
            <div className="bg-white rounded-lg shadow-lg border border-neutral-200 p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <DevicePhoneMobileIcon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-neutral-900">
                                Install BayiCare
                            </h3>
                            <p className="text-sm text-neutral-600">
                                Akses lebih cepat dari layar utama
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <div className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
                        <span>Buka tanpa browser</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <div className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
                        <span>Akses offline</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <div className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
                        <span>Notifikasi pengingat</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleDismiss}
                        className="flex-1 px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
                    >
                        Nanti saja
                    </button>
                    <button
                        onClick={handleInstallClick}
                        className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                        Install
                    </button>
                </div>
            </div>
        </div>
    )
}

// iOS-specific install instructions
export function IOSInstallPrompt() {
    const [showIOSPrompt, setShowIOSPrompt] = useState(false)

    useEffect(() => {
        // Check if iOS and not installed
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        const isInstalled = window.navigator.standalone === true
        const dismissed = localStorage.getItem('ios-install-dismissed')

        if (isIOS && !isInstalled && !dismissed) {
            // Show after a delay
            setTimeout(() => setShowIOSPrompt(true), 3000)
        }
    }, [])

    const handleDismiss = () => {
        setShowIOSPrompt(false)
        localStorage.setItem('ios-install-dismissed', 'true')
    }

    if (!showIOSPrompt) return null

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50">
            <div className="bg-white rounded-lg shadow-lg border border-neutral-200 p-4">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-neutral-900">
                        Install BayiCare
                    </h3>
                    <button
                        onClick={handleDismiss}
                        className="text-neutral-400 hover:text-neutral-600"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-sm text-neutral-600 mb-4">
                    Untuk menginstall aplikasi ini di iPhone/iPad:
                </p>

                <div className="space-y-2 text-sm text-neutral-700">
                    <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                        <span>Tap tombol Share</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                        <span>Pilih &quot;Add to Home Screen&quot;</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                        <span>Tap &quot;Add&quot;</span>
                    </div>
                </div>
            </div>
        </div>
    )
}