'use client'

import { useState, useEffect } from 'react'
import { useNotificationStore } from '@/stores/notificationStore'
import { PushNotificationService } from '@/lib/push-notification-service'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BellIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export function PushNotificationSettings() {
    const {
        pushNotificationPermission,
        pushSubscription,
        requestPushPermission,
        subscribeToPush,
        unsubscribeFromPush,
        initializePushNotifications,
        addToastNotification
    } = useNotificationStore()

    const [isLoading, setIsLoading] = useState(false)
    const [isTestingNotification, setIsTestingNotification] = useState(false)

    // Initialize push notifications on component mount
    useEffect(() => {
        initializePushNotifications()
    }, [initializePushNotifications])

    const isSupported = PushNotificationService.isSupported()
    const isEnabled = pushNotificationPermission === 'granted' && pushSubscription !== null
    const isDenied = pushNotificationPermission === 'denied'

    const handleTogglePushNotifications = async () => {
        if (isLoading) return

        setIsLoading(true)
        try {
            if (isEnabled) {
                // Unsubscribe
                await unsubscribeFromPush()
                addToastNotification({
                    id: Date.now().toString(),
                    title: 'Notifikasi Push Dinonaktifkan',
                    description: 'Anda tidak akan menerima notifikasi push lagi.',
                    type: 'success'
                })
            } else {
                // Subscribe
                const success = await requestPushPermission()
                if (success) {
                    addToastNotification({
                        id: Date.now().toString(),
                        title: 'Notifikasi Push Diaktifkan',
                        description: 'Anda akan menerima notifikasi push untuk pengingat penting.',
                        type: 'success'
                    })
                } else {
                    addToastNotification({
                        id: Date.now().toString(),
                        title: 'Gagal Mengaktifkan Notifikasi',
                        description: 'Tidak dapat mengaktifkan notifikasi push. Periksa pengaturan browser Anda.',
                        type: 'error'
                    })
                }
            }
        } catch (error) {
            console.error('Error toggling push notifications:', error)
            addToastNotification({
                id: Date.now().toString(),
                title: 'Terjadi Kesalahan',
                description: 'Gagal mengubah pengaturan notifikasi push.',
                type: 'error'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleTestNotification = async () => {
        if (isTestingNotification || !isEnabled) return

        setIsTestingNotification(true)
        try {
            const result = await PushNotificationService.testPushNotification()
            if (result.success) {
                addToastNotification({
                    id: Date.now().toString(),
                    title: 'Test Notifikasi Terkirim',
                    description: 'Periksa notifikasi push yang baru saja dikirim.',
                    type: 'success'
                })
            } else {
                addToastNotification({
                    id: Date.now().toString(),
                    title: 'Gagal Mengirim Test',
                    description: result.error || 'Tidak dapat mengirim test notifikasi.',
                    type: 'error'
                })
            }
        } catch (error) {
            console.error('Error sending test notification:', error)
            addToastNotification({
                id: Date.now().toString(),
                title: 'Terjadi Kesalahan',
                description: 'Gagal mengirim test notifikasi.',
                type: 'error'
            })
        } finally {
            setIsTestingNotification(false)
        }
    }

    if (!isSupported) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BellIcon className="w-5 h-5" />
                        Notifikasi Push
                    </CardTitle>
                    <CardDescription>
                        Terima pengingat penting langsung di perangkat Anda
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        <AlertDescription>
                            Browser Anda tidak mendukung notifikasi push. Silakan gunakan browser yang lebih baru seperti Chrome, Firefox, atau Safari.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BellIcon className="w-5 h-5" />
                    Notifikasi Push
                </CardTitle>
                <CardDescription>
                    Terima pengingat penting langsung di perangkat Anda
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Status Alert */}
                {isDenied && (
                    <Alert>
                        <XCircleIcon className="w-4 h-4" />
                        <AlertDescription>
                            Notifikasi push diblokir. Untuk mengaktifkan, klik ikon gembok di address bar dan izinkan notifikasi.
                        </AlertDescription>
                    </Alert>
                )}

                {isEnabled && (
                    <Alert>
                        <CheckCircleIcon className="w-4 h-4" />
                        <AlertDescription>
                            Notifikasi push aktif. Anda akan menerima pengingat untuk imunisasi, pertumbuhan, dan MPASI.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Toggle Switch */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Aktifkan Notifikasi Push</p>
                        <p className="text-xs text-gray-500">
                            Terima pengingat untuk jadwal imunisasi, pemantauan pertumbuhan, dan saran MPASI
                        </p>
                    </div>
                    <Switch
                        checked={isEnabled}
                        onCheckedChange={handleTogglePushNotifications}
                        disabled={isLoading || isDenied}
                    />
                </div>

                {/* Test Notification Button */}
                {isEnabled && (
                    <div className="pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleTestNotification}
                            disabled={isTestingNotification}
                            className="w-full sm:w-auto"
                        >
                            {isTestingNotification ? 'Mengirim...' : 'Test Notifikasi'}
                        </Button>
                    </div>
                )}

                {/* Information */}
                <div className="text-xs text-gray-500 space-y-1">
                    <p>• Notifikasi akan dikirim untuk pengingat imunisasi 3 hari sebelum jadwal</p>
                    <p>• Peringatan pertumbuhan akan dikirim jika Z-score di luar rentang normal</p>
                    <p>• Saran menu MPASI akan dikirim secara berkala sesuai usia anak</p>
                </div>
            </CardContent>
        </Card>
    )
}