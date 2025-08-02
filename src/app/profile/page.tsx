'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { PushNotificationSettings } from '@/components/notifications/PushNotificationSettings'
import { PushNotificationTest } from '@/components/notifications/PushNotificationTest'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { UserIcon, ShieldCheckIcon, BellIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

export default function ProfilePage() {
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    if (!session) {
        redirect('/auth/signin')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Profil Pengguna</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Kelola informasi akun, pengaturan notifikasi, dan preferensi aplikasi Anda
                    </p>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    {/* User Profile Section */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* User Information - Larger Card */}
                        <Card className="lg:col-span-2">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <UserIcon className="w-6 h-6 text-orange-500" />
                                    Informasi Akun
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Informasi dasar dan pengaturan akun Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center space-x-6">
                                    {session.user?.image ? (
                                        <img
                                            src={session.user.image}
                                            alt="Profile"
                                            className="w-20 h-20 rounded-full border-4 border-orange-100 shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                                            <UserIcon className="w-10 h-10 text-orange-500" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                            {session.user?.name || 'Pengguna'}
                                        </h3>
                                        <p className="text-gray-600 mb-3">{session.user?.email}</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                                Akun Aktif
                                            </span>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                                Google Account
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <UserIcon className="w-4 h-4" />
                                        Edit Profil
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-2">
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
                                    <InformationCircleIcon className="w-5 h-5 text-blue-500" />
                                    Statistik
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">0</div>
                                    <div className="text-sm text-gray-600">Anak Terdaftar</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">0</div>
                                    <div className="text-sm text-gray-600">Data Pertumbuhan</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">0</div>
                                    <div className="text-sm text-gray-600">Imunisasi Selesai</div>
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
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <ShieldCheckIcon className="w-6 h-6 text-green-500" />
                                    Privasi & Keamanan
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Pengaturan keamanan dan privasi data
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                        <h4 className="text-sm font-semibold text-green-800 mb-2">
                                            🔒 Data Anak Terlindungi
                                        </h4>
                                        <p className="text-xs text-green-700">
                                            Semua data anak Anda dienkripsi dan disimpan dengan aman.
                                            Hanya Anda yang dapat mengakses data ini.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <h4 className="text-sm font-semibold text-blue-800 mb-2">
                                            🛡️ Tidak Ada Berbagi Data
                                        </h4>
                                        <p className="text-xs text-blue-700">
                                            Data Anda tidak akan dibagikan kepada pihak ketiga
                                            tanpa persetujuan eksplisit.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t space-y-3">
                                    <Button variant="outline" size="sm" className="w-full">
                                        Lihat Kebijakan Privasi
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full">
                                        Pengaturan Data
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* App Information Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <InformationCircleIcon className="w-6 h-6 text-purple-500" />
                                Tentang Aplikasi BayiCare
                            </CardTitle>
                            <CardDescription className="text-base">
                                Informasi aplikasi dan dukungan teknis
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900">Informasi Aplikasi</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Versi Aplikasi</span>
                                            <span className="font-medium text-gray-900">1.0.0</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Standar Pertumbuhan</span>
                                            <span className="font-medium text-gray-900">WHO 2006</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Jadwal Imunisasi</span>
                                            <span className="font-medium text-gray-900">Kemenkes RI 2023</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-600">Terakhir Update</span>
                                            <span className="font-medium text-gray-900">Hari ini</span>
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
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                                🧪 Testing & Development
                            </h2>
                            <PushNotificationTest />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}