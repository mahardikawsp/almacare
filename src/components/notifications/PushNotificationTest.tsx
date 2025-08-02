'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationService } from '@/lib/notification-service'
import { PushNotificationService } from '@/lib/push-notification-service'
import { PushNotificationDiagnostic } from './PushNotificationDiagnostic'
import { VapidTester } from './VapidTester'

export function PushNotificationTest() {
    const { data: session } = useSession()
    const { pushNotificationPermission, pushSubscription } = useNotificationStore()
    const [isTestingBell, setIsTestingBell] = useState(false)
    const [isTestingToast, setIsTestingToast] = useState(false)
    const [isTestingPush, setIsTestingPush] = useState(false)
    const [isTestingIntegrated, setIsTestingIntegrated] = useState(false)

    const isEnabled = pushNotificationPermission === 'granted' && pushSubscription !== null

    const handleTestBellNotification = () => {
        if (isTestingBell) return
        setIsTestingBell(true)

        NotificationService.addBellNotification({
            title: 'Test Bell Notification',
            message: 'Ini adalah test notifikasi bell. Notifikasi ini akan muncul di daftar notifikasi.',
            type: 'system',
            isRead: false,
            actionUrl: '/profile'
        })

        setTimeout(() => setIsTestingBell(false), 1000)
    }

    const handleTestToastNotification = () => {
        if (isTestingToast) return
        setIsTestingToast(true)

        NotificationService.addToastNotification({
            title: 'Test Toast Notification',
            description: 'Ini adalah test notifikasi toast. Notifikasi ini akan hilang otomatis.',
            type: 'info',
            duration: 5000,
            autoHide: true
        })

        setTimeout(() => setIsTestingToast(false), 1000)
    }

    const handleTestPushNotification = async () => {
        if (isTestingPush || !isEnabled) return
        setIsTestingPush(true)

        try {
            const result = await PushNotificationService.testPushNotification()
            if (result.success) {
                NotificationService.addToastNotification({
                    title: 'Push Notification Sent',
                    description: 'Test push notification berhasil dikirim. Periksa notifikasi di perangkat Anda.',
                    type: 'success'
                })
            } else {
                NotificationService.addToastNotification({
                    title: 'Push Notification Failed',
                    description: result.error || 'Gagal mengirim test push notification.',
                    type: 'error'
                })
            }
        } catch (error) {
            NotificationService.addToastNotification({
                title: 'Error',
                description: 'Terjadi kesalahan saat mengirim test push notification.',
                type: 'error'
            })
        } finally {
            setIsTestingPush(false)
        }
    }

    const handleTestIntegratedNotification = async () => {
        if (isTestingIntegrated || !session?.user?.id) return
        setIsTestingIntegrated(true)

        try {
            // Test immunization reminder
            await NotificationService.scheduleImmunizationReminder(
                'test-child-id',
                'Anak Test',
                'DPT-HB-Hib 1',
                new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
                session.user.id
            )

            // Test growth alert
            await NotificationService.notifyGrowthAlert(
                'test-child-id',
                'Anak Test',
                'Berat Badan/Umur',
                -2.5, // Below normal
                session.user.id
            )

            // Test MPASI suggestion
            await NotificationService.suggestMPASIRecipe(
                'test-child-id',
                'Anak Test',
                'Bubur Ayam Wortel',
                session.user.id
            )

            NotificationService.addToastNotification({
                title: 'Integrated Test Complete',
                description: 'Semua jenis notifikasi telah ditest. Periksa bell notifications dan push notifications.',
                type: 'success'
            })
        } catch (error) {
            NotificationService.addToastNotification({
                title: 'Test Failed',
                description: 'Gagal menjalankan integrated test.',
                type: 'error'
            })
        } finally {
            setIsTestingIntegrated(false)
        }
    }

    if (!session) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Push Notification Test</CardTitle>
                    <CardDescription>Login required to test push notifications</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Push Notification Test</CardTitle>
                    <CardDescription>
                        Test berbagai jenis notifikasi untuk memastikan sistem berfungsi dengan baik
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Status */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">
                            <strong>Status:</strong> {pushNotificationPermission || 'Unknown'} |
                            <strong> Subscription:</strong> {pushSubscription ? 'Active' : 'None'}
                        </p>
                    </div>

                    {/* Test Buttons */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Button
                            variant="outline"
                            onClick={handleTestBellNotification}
                            disabled={isTestingBell}
                            className="w-full"
                        >
                            {isTestingBell ? 'Testing...' : 'Test Bell Notification'}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleTestToastNotification}
                            disabled={isTestingToast}
                            className="w-full"
                        >
                            {isTestingToast ? 'Testing...' : 'Test Toast Notification'}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleTestPushNotification}
                            disabled={isTestingPush || !isEnabled}
                            className="w-full"
                        >
                            {isTestingPush ? 'Testing...' : 'Test Push Notification'}
                        </Button>

                        <Button
                            variant="primary"
                            onClick={handleTestIntegratedNotification}
                            disabled={isTestingIntegrated}
                            className="w-full"
                        >
                            {isTestingIntegrated ? 'Testing...' : 'Test All Notifications'}
                        </Button>
                    </div>

                    {/* Instructions */}
                    <div className="text-xs text-gray-500 space-y-1">
                        <p>• <strong>Bell Notification:</strong> Muncul di daftar notifikasi (ikon lonceng)</p>
                        <p>• <strong>Toast Notification:</strong> Popup sementara di pojok layar</p>
                        <p>• <strong>Push Notification:</strong> Notifikasi sistem (perlu permission)</p>
                        <p>• <strong>Test All:</strong> Menguji semua jenis notifikasi sekaligus</p>
                    </div>
                </CardContent>
            </Card>

            <VapidTester />

            <PushNotificationDiagnostic />
        </div>
    )
}