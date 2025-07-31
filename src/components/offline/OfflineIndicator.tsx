'use client'

import { useState, useEffect } from 'react'
import { WifiIcon } from '@heroicons/react/24/outline'
import { NoSymbolIcon } from '@heroicons/react/24/outline'

interface OfflineIndicatorProps {
    className?: string
}

export function OfflineIndicator({ className = '' }: OfflineIndicatorProps) {
    const [isOnline, setIsOnline] = useState(true)
    const [showIndicator, setShowIndicator] = useState(false)

    useEffect(() => {
        // Set initial state
        setIsOnline(navigator.onLine)

        const handleOnline = () => {
            setIsOnline(true)
            setShowIndicator(true)
            // Hide the "back online" indicator after 3 seconds
            setTimeout(() => setShowIndicator(false), 3000)
        }

        const handleOffline = () => {
            setIsOnline(false)
            setShowIndicator(true)
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Don't show indicator if online and not recently changed
    if (isOnline && !showIndicator) {
        return null
    }

    return (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
            <div
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-sm font-medium
                    transition-all duration-300 ease-in-out
                    ${isOnline
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }
                `}
            >
                {isOnline ? (
                    <>
                        <WifiIcon className="w-4 h-4" />
                        <span>Kembali online</span>
                    </>
                ) : (
                    <>
                        <NoSymbolIcon className="w-4 h-4" />
                        <span>Tidak ada koneksi</span>
                    </>
                )}
            </div>
        </div>
    )
}