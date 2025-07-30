'use client'

import useSWR from 'swr'
import { apiUrls } from '@/lib/swr-config'

interface ImmunizationStatsProps {
    childId: string
}

interface ImmunizationStatsData {
    total: number
    completed: number
    scheduled: number
    overdue: number
    skipped: number
}

export function ImmunizationStats({ childId }: ImmunizationStatsProps) {
    const { data, error, isLoading } = useSWR(
        `${apiUrls.immunizationRecords(childId)}/stats`,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true
        }
    )

    const stats: ImmunizationStatsData = data?.stats || {
        total: 0,
        completed: 0,
        scheduled: 0,
        overdue: 0,
        skipped: 0
    }

    const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="text-center text-red-600">
                    <p>Gagal memuat statistik imunisasi</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                        Coba lagi
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Overall Progress */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Progress Imunisasi
                </h3>

                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            Kelengkapan Imunisasi
                        </span>
                        <span className="text-sm font-semibold text-blue-600">
                            {completionPercentage}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                        {stats.completed} / {stats.total}
                    </p>
                    <p className="text-sm text-gray-600">
                        Imunisasi telah diselesaikan
                    </p>
                </div>
            </div>

            {/* Detailed Stats */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Rincian Status
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Completed */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
                        <p className="text-sm text-green-600">Selesai</p>
                    </div>

                    {/* Scheduled */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-2xl font-bold text-blue-700">{stats.scheduled}</p>
                        <p className="text-sm text-blue-600">Terjadwal</p>
                    </div>

                    {/* Overdue */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 text-center">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
                        <p className="text-sm text-red-600">Terlambat</p>
                    </div>

                    {/* Skipped */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 text-center">
                        <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </div>
                        <p className="text-2xl font-bold text-gray-700">{stats.skipped}</p>
                        <p className="text-sm text-gray-600">Dilewati</p>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            {(stats.overdue > 0 || completionPercentage < 80) && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-orange-900 mb-2">
                                Rekomendasi
                            </h4>
                            <div className="space-y-1 text-sm text-orange-800">
                                {stats.overdue > 0 && (
                                    <p>• Segera konsultasikan dengan dokter untuk imunisasi yang terlambat</p>
                                )}
                                {completionPercentage < 80 && (
                                    <p>• Pastikan mengikuti jadwal imunisasi yang telah ditentukan</p>
                                )}
                                <p>• Catat tanggal imunisasi berikutnya di kalender</p>
                                <p>• Hubungi fasilitas kesehatan untuk konfirmasi jadwal</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {completionPercentage === 100 && stats.overdue === 0 && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-green-900 mb-1">
                                Selamat! Imunisasi Lengkap
                            </h4>
                            <p className="text-sm text-green-800">
                                Semua imunisasi wajib telah diselesaikan sesuai jadwal.
                                Tetap pantau jadwal imunisasi lanjutan jika ada.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}