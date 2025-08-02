'use client'

import React from 'react'
import { useToast } from '@/hooks/useToast'

export function ToastDemo() {
    const { success, error, warning, info, dismissAll } = useToast()

    const handleSuccessToast = () => {
        success(
            'Berhasil!',
            'Data anak berhasil disimpan ke database.',
            {
                action: {
                    label: 'Lihat Detail',
                    onClick: () => console.log('View details clicked')
                }
            }
        )
    }

    const handleErrorToast = () => {
        error(
            'Terjadi Kesalahan',
            'Gagal menyimpan data. Silakan coba lagi.',
            {
                autoHide: false, // Don't auto-hide error messages
                action: {
                    label: 'Coba Lagi',
                    onClick: () => console.log('Retry clicked')
                }
            }
        )
    }

    const handleWarningToast = () => {
        warning(
            'Peringatan Imunisasi',
            'Jadwal imunisasi BCG untuk Anak akan jatuh tempo dalam 3 hari.',
            {
                duration: 10000, // Custom duration
                action: {
                    label: 'Atur Pengingat',
                    onClick: () => console.log('Set reminder clicked')
                }
            }
        )
    }

    const handleInfoToast = () => {
        info(
            'Tips MPASI',
            'Usia 6 bulan adalah waktu yang tepat untuk memulai MPASI.',
            {
                action: {
                    label: 'Pelajari Lebih Lanjut',
                    onClick: () => console.log('Learn more clicked')
                }
            }
        )
    }

    const handleMultipleToasts = () => {
        success('Toast 1', 'Ini adalah toast pertama')
        setTimeout(() => {
            warning('Toast 2', 'Ini adalah toast kedua')
        }, 500)
        setTimeout(() => {
            info('Toast 3', 'Ini adalah toast ketiga')
        }, 1000)
    }

    return (
        <div className="p-6 space-y-6 bg-background-primary min-h-screen">
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-primary-200">
                <h2 className="text-2xl font-bold text-berkeley-blue mb-2">
                    🔔 Demo Notifikasi Toast
                </h2>
                <p className="text-neutral-600 mb-6">
                    Coba berbagai jenis notifikasi toast dengan animasi slide-down yang halus
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={handleSuccessToast}
                        className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 min-h-touch"
                    >
                        <span>✅</span>
                        Success Toast
                    </button>

                    <button
                        type="button"
                        onClick={handleErrorToast}
                        className="px-6 py-3 bg-berkeley-blue text-white rounded-xl hover:bg-berkeley-blue/90 transition-all duration-200 font-semibold shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 min-h-touch"
                    >
                        <span>❌</span>
                        Error Toast
                    </button>

                    <button
                        type="button"
                        onClick={handleWarningToast}
                        className="px-6 py-3 bg-neutral-500 text-white rounded-xl hover:bg-neutral-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 min-h-touch"
                    >
                        <span>⚠️</span>
                        Warning Toast
                    </button>

                    <button
                        type="button"
                        onClick={handleInfoToast}
                        className="px-6 py-3 bg-primary-400 text-white rounded-xl hover:bg-primary-500 transition-all duration-200 font-semibold shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 min-h-touch"
                    >
                        <span>ℹ️</span>
                        Info Toast
                    </button>

                    <button
                        type="button"
                        onClick={handleMultipleToasts}
                        className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 min-h-touch"
                    >
                        <span>📚</span>
                        Multiple Toasts
                    </button>

                    <button
                        type="button"
                        onClick={dismissAll}
                        className="px-6 py-3 bg-neutral-400 text-white rounded-xl hover:bg-neutral-500 transition-all duration-200 font-semibold shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 min-h-touch"
                    >
                        <span>🗑️</span>
                        Dismiss All
                    </button>
                </div>
            </div>

            <div className="bg-alice-blue rounded-2xl p-6 border border-primary-200">
                <h3 className="font-bold text-berkeley-blue mb-3 flex items-center gap-2">
                    <span>🎯</span>
                    Fitur yang Didemonstrasikan:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-primary-100">
                        <span className="text-primary-500">🎨</span>
                        <span className="text-sm text-neutral-700">4 jenis toast (success, error, warning, info)</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-primary-100">
                        <span className="text-primary-500">✨</span>
                        <span className="text-sm text-neutral-700">Animasi slide-down yang halus</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-primary-100">
                        <span className="text-primary-500">⏰</span>
                        <span className="text-sm text-neutral-700">Auto-hide dengan durasi custom</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-primary-100">
                        <span className="text-primary-500">🔘</span>
                        <span className="text-sm text-neutral-700">Tombol aksi dalam notifikasi</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-primary-100">
                        <span className="text-primary-500">👆</span>
                        <span className="text-sm text-neutral-700">Manual dismiss dan dismiss all</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-primary-100">
                        <span className="text-primary-500">📚</span>
                        <span className="text-sm text-neutral-700">Notifikasi bertumpuk</span>
                    </div>
                </div>
            </div>
        </div>
    )
}