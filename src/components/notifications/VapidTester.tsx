'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, KeyIcon } from '@heroicons/react/24/outline'
import { PushNotificationService } from '@/lib/push-notification-service'

interface VapidTestResult {
    success: boolean
    message: string
    results: {
        vapidKeysConfigured: {
            publicKey: boolean
            privateKey: boolean
            publicKeyLength: number
            privateKeyLength: number
            publicKeyPreview: string
        }
        webPushConfiguration: {
            configured: boolean
            error: string | null
        }
        keyValidation: {
            publicKeyValid: boolean
            privateKeyValid: boolean
            keysMatch: boolean
            error: string | null
        }
    }
    recommendations: string[]
}

export function VapidTester() {
    const { data: session } = useSession()
    const [testResult, setTestResult] = useState<VapidTestResult | null>(null)
    const [isTestingConfig, setIsTestingConfig] = useState(false)
    const [isTestingNotification, setIsTestingNotification] = useState(false)
    const [notificationResult, setNotificationResult] = useState<any>(null)

    const testVapidConfiguration = async () => {
        setIsTestingConfig(true)
        setTestResult(null)

        try {
            const response = await fetch('/api/notifications/vapid-test')
            const result = await response.json()
            setTestResult(result)
        } catch (error) {
            setTestResult({
                success: false,
                message: 'Failed to test VAPID configuration',
                results: {
                    vapidKeysConfigured: {
                        publicKey: false,
                        privateKey: false,
                        publicKeyLength: 0,
                        privateKeyLength: 0,
                        publicKeyPreview: 'Error'
                    },
                    webPushConfiguration: {
                        configured: false,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    },
                    keyValidation: {
                        publicKeyValid: false,
                        privateKeyValid: false,
                        keysMatch: false,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    }
                },
                recommendations: ['Check server connection and try again']
            })
        } finally {
            setIsTestingConfig(false)
        }
    }

    const testVapidNotification = async () => {
        setIsTestingNotification(true)
        setNotificationResult(null)

        try {
            // First get current subscription
            const subscription = await PushNotificationService.getSubscription()

            if (!subscription) {
                setNotificationResult({
                    success: false,
                    error: 'No active push subscription found. Please enable push notifications first.'
                })
                return
            }

            // Test sending notification with VAPID keys
            const response = await fetch('/api/notifications/vapid-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subscription: subscription.toJSON()
                })
            })

            const result = await response.json()
            setNotificationResult(result)

        } catch (error) {
            setNotificationResult({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        } finally {
            setIsTestingNotification(false)
        }
    }

    const getStatusIcon = (success: boolean) => {
        return success ?
            <CheckCircleIcon className="w-5 h-5 text-green-500" /> :
            <XCircleIcon className="w-5 h-5 text-red-500" />
    }

    const getStatusColor = (success: boolean) => {
        return success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <KeyIcon className="w-5 h-5 text-blue-500" />
                    VAPID Configuration Tester
                </CardTitle>
                <CardDescription>
                    Test if your VAPID keys are properly configured and working
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Configuration Test */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-medium">VAPID Configuration Test</h4>
                            <p className="text-xs text-gray-500">
                                Verify that VAPID keys are properly set and valid
                            </p>
                        </div>
                        <Button
                            onClick={testVapidConfiguration}
                            disabled={isTestingConfig}
                            size="sm"
                        >
                            {isTestingConfig ? 'Testing...' : 'Test Config'}
                        </Button>
                    </div>

                    {testResult && (
                        <div className={`p-4 rounded-lg border ${getStatusColor(testResult.success)}`}>
                            <div className="flex items-start gap-3">
                                {getStatusIcon(testResult.success)}
                                <div className="flex-1">
                                    <h5 className="text-sm font-medium">
                                        {testResult.message}
                                    </h5>

                                    <div className="mt-3 space-y-2 text-xs">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <strong>Public Key:</strong>
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(testResult.results.vapidKeysConfigured.publicKey)}
                                                    <span>
                                                        {testResult.results.vapidKeysConfigured.publicKey ?
                                                            `${testResult.results.vapidKeysConfigured.publicKeyLength} chars` :
                                                            'Not set'
                                                        }
                                                    </span>
                                                </div>
                                                {testResult.results.vapidKeysConfigured.publicKey && (
                                                    <div className="text-gray-500 font-mono text-xs mt-1">
                                                        {testResult.results.vapidKeysConfigured.publicKeyPreview}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <strong>Private Key:</strong>
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(testResult.results.vapidKeysConfigured.privateKey)}
                                                    <span>
                                                        {testResult.results.vapidKeysConfigured.privateKey ?
                                                            `${testResult.results.vapidKeysConfigured.privateKeyLength} chars` :
                                                            'Not set'
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t">
                                            <strong>Validation Results:</strong>
                                            <div className="grid grid-cols-2 gap-2 mt-1">
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(testResult.results.keyValidation.publicKeyValid)}
                                                    <span>Public Key Format</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(testResult.results.keyValidation.privateKeyValid)}
                                                    <span>Private Key Format</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(testResult.results.webPushConfiguration.configured)}
                                                    <span>Web-Push Config</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(testResult.results.keyValidation.keysMatch)}
                                                    <span>Keys Compatible</span>
                                                </div>
                                            </div>
                                        </div>

                                        {testResult.recommendations.length > 0 && (
                                            <div className="pt-2 border-t">
                                                <strong>Recommendations:</strong>
                                                <ul className="list-disc list-inside mt-1 space-y-1">
                                                    {testResult.recommendations.map((rec, index) => (
                                                        <li key={index} className="text-red-700">{rec}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Notification Test */}
                <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-medium">VAPID Notification Test</h4>
                            <p className="text-xs text-gray-500">
                                Send a real push notification using your VAPID keys
                            </p>
                        </div>
                        <Button
                            onClick={testVapidNotification}
                            disabled={isTestingNotification || !session}
                            size="sm"
                            variant="outline"
                        >
                            {isTestingNotification ? 'Sending...' : 'Test Notification'}
                        </Button>
                    </div>

                    {!session && (
                        <Alert>
                            <ExclamationTriangleIcon className="w-4 h-4" />
                            <AlertDescription>
                                You need to be logged in to test push notifications
                            </AlertDescription>
                        </Alert>
                    )}

                    {notificationResult && (
                        <div className={`p-4 rounded-lg border ${getStatusColor(notificationResult.success)}`}>
                            <div className="flex items-start gap-3">
                                {getStatusIcon(notificationResult.success)}
                                <div className="flex-1">
                                    <h5 className="text-sm font-medium">
                                        {notificationResult.success ?
                                            'VAPID Test Notification Sent!' :
                                            'Failed to Send Test Notification'
                                        }
                                    </h5>

                                    {notificationResult.error && (
                                        <p className="text-xs text-red-700 mt-1">
                                            {notificationResult.error}
                                        </p>
                                    )}

                                    {notificationResult.details && (
                                        <div className="mt-2 text-xs">
                                            <strong>Details:</strong>
                                            <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                                                {JSON.stringify(notificationResult.details, null, 2)}
                                            </pre>
                                        </div>
                                    )}

                                    {notificationResult.success && (
                                        <p className="text-xs text-green-700 mt-2">
                                            ✅ Check your device for the test notification!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Environment Info */}
                <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Environment Information</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                        <div>
                            <strong>Public Key (Client):</strong> {process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?
                                `${process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY.substring(0, 20)}...` :
                                'Not accessible from client'
                            }
                        </div>
                        <div>
                            <strong>Browser Support:</strong> {PushNotificationService.isSupported() ?
                                '✅ Supported' :
                                '❌ Not Supported'
                            }
                        </div>
                        <div>
                            <strong>Current Permission:</strong> {typeof window !== 'undefined' ?
                                Notification.permission :
                                'Unknown'
                            }
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}