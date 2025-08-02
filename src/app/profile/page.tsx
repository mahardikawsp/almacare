'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { PushNotificationSettings } from '@/components/notifications/PushNotificationSettings'
import { PushNotificationTest } from '@/components/notifications/PushNotificationTest'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useChildStore } from '@/stores/childStore'
import { useGrowthStore } from '@/stores/growthStore'
import {
    UserIcon,
    ShieldCheckIcon,
    InformationCircleIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
    ChartBarIcon,
    HeartIcon,
    BellIcon
} from '@heroicons/react/24/outline'

function ProfileContent() {
    const { data: session } = useSession()
    const { children } = useChildStore()
    const { growthRecords } = useGrowthStore()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await signOut({
                callbackUrl: '/',
                redirect: true
            })
        } catch (error) {
            console.error('Logout error:', error)
            setIsLoggingOut(false)
        }
    }

    // Calculate stats
    const childrenCount = children.length
    const growthRecordsCount = growthRecords.length
    const completedImmunizations = 0 // This would come from immunization store

    return (
        <AppLayout>
            <div className="space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                            Profil Pengguna
                        </h1>
                        <p className="text-gray-600">
                            Kelola informasi akun dan pengaturan aplikasi Anda
                        </p>
                    </div>
                    <Button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        variant="outline"
                        className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 sm:flex-shrink-0"
                    >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        {isLoggingOut ? 'Keluar...' : 'Keluar'}
                    </Button>
                </div>

                {/* User Profile Section */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* User Information - Larger Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <UserIcon className="w-5 h-5 text-orange-600" />
                                </div>
                                Informasi Akun
                            </CardTitle>
                            <CardDescription className="text-sm sm:text-base">
                                Informasi dasar dan pengaturan akun Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                                {session?.user?.image ? (
                                    <img
                                        src={session.user.image}
                                        alt="Profile"
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-orange-100 shadow-lg mx-auto sm:mx-0"
                                    />
                                ) : (
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto sm:mx-0">
                                        <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                                    </div>
                                )}
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                                        {session?.user?.name || 'Pengguna'}
                                    </h3>
                                    <p className="text-gray-600 mb-3 text-sm sm:text-base">{session?.user?.email}</p>
                                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs sm:text-sm rounded-full">
                                            ✓ Akun Aktif
                                        </span>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm rounded-full">
                                            🔗 Google Account
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t">
                                <Button variant="outline" className="flex items-center gap-2 justify-center">
                                    <Cog6ToothIcon className="w-4 h-4" />
                                    Edit Profil
                                </Button>
                                <Button variant="outline" className="flex items-center gap-2 justify-center">
                                    <ShieldCheckIcon className="w-4 h-4" />
                                    Keamanan
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <ChartBarIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                Statistik
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">{childrenCount}</div>
                                <div className="text-xs sm:text-sm text-gray-600 font-medium">Anak Terdaftar</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">{growthRecordsCount}</div>
                                <div className="text-xs sm:text-sm text-gray-600 font-medium">Data Pertumbuhan</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{completedImmunizations}</div>
                                <div className="text-xs sm:text-sm text-gray-600 font-medium">Imunisasi Selesai</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Notification Settings Section */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Push Notification Settings */}
                    <div className="lg:col-span-1">
                        <PushNotificationSettings />
                    </div>

                    {/* Privacy & Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                                </div>
                                Privasi & Keamanan
                            </CardTitle>
                            <CardDescription className="text-sm sm:text-base">
                                Pengaturan keamanan dan privasi data
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                    <h4 className="text-sm font-semibold text-green-800 mb-2">
                                        🔒 Data Anak Terlindungi
                                    </h4>
                                    <p className="text-xs text-green-700 leading-relaxed">
                                        Semua data anak Anda dienkripsi dan disimpan dengan aman.
                                        Hanya Anda yang dapat mengakses data ini.
                                    </p>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <h4 className="text-sm font-semibold text-blue-800 mb-2">
                                        🛡️ Tidak Ada Berbagi Data
                                    </h4>
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                        Data Anda tidak akan dibagikan kepada pihak ketiga
                                        tanpa persetujuan eksplisit.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t space-y-3">
                                <Button variant="outline" size="sm" className="w-full">
                                    📋 Lihat Kebijakan Privasi
                                </Button>
                                <Button variant="outline" size="sm" className="w-full">
                                    ⚙️ Pengaturan Data
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* App Information Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <InformationCircleIcon className="w-5 h-5 text-purple-600" />
                            </div>
                            Tentang Aplikasi AlmaCare
                        </CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                            Informasi aplikasi dan dukungan teknis
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900">Informasi Aplikasi</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600 text-sm">Versi Aplikasi</span>
                                        <span className="font-medium text-gray-900 text-sm">1.0.0</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600 text-sm">Standar Pertumbuhan</span>
                                        <span className="font-medium text-gray-900 text-sm">WHO 2006</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600 text-sm">Jadwal Imunisasi</span>
                                        <span className="font-medium text-gray-900 text-sm">Kemenkes RI 2023</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600 text-sm">Terakhir Update</span>
                                        <span className="font-medium text-gray-900 text-sm">Hari ini</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900">Dukungan & Bantuan</h4>
                                <div className="space-y-3">
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        📚 Bantuan & FAQ
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        💬 Hubungi Support
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        ⭐ Beri Rating
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        📝 Kirim Feedback
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Development Testing Section */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="border-t pt-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">
                            🧪 Testing & Development
                        </h2>
                        <PushNotificationTest />
                    </div>
                )}
            </div>
        </AppLayout>
    )
}

export default function ProfilePage() {
    return (
        <AuthGuard>
            <ProfileContent />
        </AuthGuard>
    )
}