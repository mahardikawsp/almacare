'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface DiagnosticResult {
    name: string
    status: 'success' | 'error' | 'warning'
    message: string
    details?: string
}

export function PushNotificationDiagnostic() {
    const { data: session } = useSession()
    const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([])
    const [isRunning, setIsRunning] = useState(false)

    const runDiagnostics = async () => {
        setIsRunning(true)
        const results: DiagnosticResult[] = []

        // Check browser support
        if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
            results.push({
                name: 'Browser Support',
                status: 'success',
                message: 'Browser supports push notifications'
            })
        } else {
            results.push({
                name: 'Browser Support',
                status: 'error',
                message: 'Browser does not support push notifications'
            })
        }

        // Check notification permission
        const permission = Notification.permission
        if (permission === 'granted') {
            results.push({
                name: 'Notification Permission',
                status: 'success',
                message: 'Permission granted'
            })
        } else if (permission === 'denied') {
            results.push({
                name: 'Notification Permission',
                status: 'error',
                message: 'Permission denied'
            })
        } else {
            results.push({
                name: 'Notification Permission',
                status: 'warning',
                message: 'Permission not requested yet'
            })
        }

        // Check service worker registration
        try {
            const registration = await navigator.serviceWorker.getRegistration()
            if (registration) {
                results.push({
                    name: 'Service Worker',
                    status: 'success',
                    message: 'Service worker registered',
                    details: `Scope: ${registration.scope}`
                })
            } else {
                results.push({
                    name: 'Service Worker',
                    status: 'error',
                    message: 'Service worker not registered'
                })
            }
        } catch (error) {
            results.push({
                name: 'Service Worker',
                status: 'error',
                message: 'Error checking service worker',
                details: error instanceof Error ? error.message : 'Unknown error'
            })
        }

        // Check push subscription
        try {
            const registration = await navigator.serviceWorker.getRegistration()
            if (registration) {
                const subscription = await registration.pushManager.getSubscription()
                if (subscription) {
                    results.push({
                        name: 'Push Subscription',
                        status: 'success',
                        message: 'Active push subscription found',
                        details: `Endpoint: ${subscription.endpoint.substring(0, 50)}...`
                    })
                } else {
                    results.push({
                        name: 'Push Subscription',
                        status: 'warning',
                        message: 'No active push subscription'
                    })
                }
            }
        } catch (error) {
            results.push({
                name: 'Push Subscription',
                status: 'error',
                message: 'Error checking push subscription',
                details: error instanceof Error ? error.message : 'Unknown error'
            })
        }

        // Check VAPID keys
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (vapidKey) {
            results.push({
                name: 'VAPID Configuration',
                status: 'success',
                message: 'VAPID public key configured',
                details: `Key: ${vapidKey.substring(0, 20)}...`
            })
        } else {
            results.push({
                name: 'VAPID Configuration',
                status: 'error',
                message: 'VAPID public key not configured'
            })
        }

        // Check server connectivity
        try {
            const response = await fetch('/api/health')
            if (response.ok) {
                results.push({
                    name: 'Server Connectivity',
                    status: 'success',
                    message: 'Server is reachable'
                })
            } else {
                results.push({
                    name: 'Server Connectivity',
                    status: 'warning',
                    message: `Server responded with status ${response.status}`
                })
            }
        } catch (error) {
            results.push({
                name: 'Server Connectivity',
                status: 'error',
                message: 'Cannot reach server',
                details: error instanceof Error ? error.message : 'Unknown error'
            })
        }

        // Check user authentication
        if (session?.user?.id) {
            results.push({
                name: 'User Authentication',
                status: 'success',
                message: 'User is authenticated',
                details: `User ID: ${session.user.id}`
            })
        } else {
            results.push({
                name: 'User Authentication',
                status: 'error',
                message: 'User is not authenticated'
            })
        }

        setDiagnostics(results)
        setIsRunning(false)
    }

    useEffect(() => {
        runDiagnostics()
    }, [session])

    const getStatusIcon = (status: DiagnosticResult['status']) => {
        switch (status) {
            case 'success':
                return <CheckCircleIcon className="w-5 h-5 text-green-500" />
            case 'error':
                return <XCircleIcon className="w-5 h-5 text-red-500" />
            case 'warning':
                return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
        }
    }

    const getStatusColor = (status: DiagnosticResult['status']) => {
        switch (status) {
            case 'success':
                return 'border-green-200 bg-green-50'
            case 'error':
                return 'border-red-200 bg-red-50'
            case 'warning':
                return 'border-yellow-200 bg-yellow-50'
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    🔍 Push Notification Diagnostics
                </CardTitle>
                <CardDescription>
                    Diagnostic information to help troubleshoot push notification issues
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        Run diagnostics to check push notification system status
                    </p>
                    <Button
                        onClick={runDiagnostics}
                        disabled={isRunning}
                        size="sm"
                    >
                        {isRunning ? 'Running...' : 'Run Diagnostics'}
                    </Button>
                </div>

                {diagnostics.length > 0 && (
                    <div className="space-y-3">
                        {diagnostics.map((result, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
                            >
                                <div className="flex items-start gap-3">
                                    {getStatusIcon(result.status)}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium text-gray-900">
                                                {result.name}
                                            </h4>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {result.message}
                                        </p>
                                        {result.details && (
                                            <p className="text-xs text-gray-500 mt-1 font-mono">
                                                {result.details}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {diagnostics.length > 0 && (
                    <Alert>
                        <AlertDescription>
                            <strong>Summary:</strong>{' '}
                            {diagnostics.filter(d => d.status === 'success').length} passed,{' '}
                            {diagnostics.filter(d => d.status === 'warning').length} warnings,{' '}
                            {diagnostics.filter(d => d.status === 'error').length} errors
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    )
}