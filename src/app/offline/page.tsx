'use client'

import { useEffect, useState } from 'react'
import { NoSymbolIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { SyncStatus } from '@/components/offline/SyncStatus'
import { useOfflineSync } from '@/hooks/useOfflineSync'
import { Button } from '@/components/ui/button'

export default function OfflinePage() {
    const [isOnline, setIsOnline] = useState(false)
    const { pendingCount } = useOfflineSync()

    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        setIsOnline(navigator.onLine)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    const handleRetry = () => {
        if (isOnline) {
            window.location.href = '/dashboard'
        } else {
            window.location.reload()
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <NoSymbolIcon className="w-12 h-12 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                        {isOnline ? 'Kembali Online!' : 'Aplikasi Offline'}
                    </h1>
                    <p className="text-neutral-600 mb-6">
                        {isOnline
                            ? 'Koneksi internet telah pulih. Anda dapat melanjutkan menggunakan aplikasi.'
                            : 'Tidak ada koneksi internet. Beberapa fitur mungkin tidak tersedia.'
                        }
                    </p>
                </div>

                {/* Sync Status */}
                <div className="mb-6">
                    <SyncStatus />
                </div>

                {/* Pending Changes Info */}
                {pendingCount > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-orange-800 mb-2">
                            Perubahan Tertunda
                        </h3>
                        <p className="text-orange-700 text-sm">
                            {pendingCount} perubahan akan disinkronisasi saat koneksi kembali normal.
                        </p>
                    </div>
                )}

                <div className="bg-white rounded-xl p-6 shadow-soft mb-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-3">
                        Yang Masih Bisa Dilakukan:
                    </h2>
                    <ul className="text-left space-y-2 text-neutral-700">
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-accent-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Melihat data yang sudah tersimpan
                        </li>
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-accent-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Melihat grafik pertumbuhan
                        </li>
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-accent-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Membaca resep MPASI favorit
                        </li>
                        <li className="flex items-center">
                            <svg className="w-5 h-5 text-accent-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Menambah data (akan disinkronkan nanti)
                        </li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={handleRetry}
                        variant="default"
                        size="default"
                        className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowPathIcon className="w-5 h-5" />
                        {isOnline ? 'Kembali ke Dashboard' : 'Coba Lagi'}
                    </Button>

                    {!isOnline && (
                        <Button
                            onClick={() => window.location.href = '/dashboard'}
                            variant="secondary"
                            size="default"
                            className="w-full bg-neutral-200 text-neutral-700 py-3 px-6 rounded-lg font-medium hover:bg-neutral-300 transition-colors"
                        >
                            Lanjutkan Offline
                        </Button>
                    )}
                </div>

                <p className="text-sm text-neutral-500 mt-4">
                    Data akan otomatis tersinkronisasi saat koneksi kembali normal.
                </p>
            </div>
        </div>
    )
}