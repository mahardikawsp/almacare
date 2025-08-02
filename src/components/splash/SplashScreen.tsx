'use client'

import { useEffect, useState } from 'react'

interface SplashScreenProps {
    onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true)
    const [logoLoaded, setLogoLoaded] = useState(false)

    useEffect(() => {
        // Preload the logo
        const img = new Image()
        img.onload = () => setLogoLoaded(true)
        img.src = '/icon.png'

        // Show splash for minimum 2 seconds
        const timer = setTimeout(() => {
            setIsVisible(false)
            // Wait for fade out animation to complete
            setTimeout(onComplete, 500)
        }, 2000)

        return () => clearTimeout(timer)
    }, [onComplete])

    if (!isVisible) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 flex items-center justify-center z-50 animate-fade-out">
                <div className="text-center animate-scale-out">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm shadow-2xl border border-white/30">
                        {logoLoaded && (
                            <img
                                src="/icon.png"
                                alt="AlmaCare Logo"
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                        AlmaCare
                    </h1>
                    <p className="text-white/90 text-lg font-medium drop-shadow">
                        Pantau Tumbuh Kembang Anak
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 flex items-center justify-center z-50">
            <div className="text-center">
                {/* Logo with loading animation */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm shadow-2xl border border-white/30 animate-pulse-slow">
                    {logoLoaded ? (
                        <img
                            src="/icon.png"
                            alt="AlmaCare Logo"
                            className="w-full h-full object-contain animate-fade-in"
                        />
                    ) : (
                        <div className="w-full h-full bg-white/10 animate-pulse" />
                    )}
                </div>

                {/* App Name */}
                <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg animate-slide-up">
                    AlmaCare
                </h1>

                {/* Tagline */}
                <p className="text-white/90 text-lg font-medium drop-shadow animate-slide-up-delay">
                    Pantau Tumbuh Kembang Anak
                </p>

                {/* Loading indicator */}
                <div className="mt-8 flex justify-center">
                    <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>

                {/* Version info */}
                <div className="mt-8 text-white/70 text-sm animate-fade-in-delay">
                    <p>Versi 1.0.0</p>
                    <p className="mt-1">Berdasarkan standar WHO & Kemenkes RI</p>
                </div>
            </div>
        </div>
    )
}