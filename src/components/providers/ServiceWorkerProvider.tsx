'use client'

import { useEffect } from 'react'
import { useNotificationStore } from '@/stores/notificationStore'

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
    const { initializePushNotifications } = useNotificationStore()

    useEffect(() => {
        // Temporarily disable service worker to fix navigation issues
        if (false && 'serviceWorker' in navigator) {
            const registerServiceWorker = async () => {
                try {
                    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    console.log('Service Worker registered successfully:', registration)
                    return registration
                } catch (error) {
                    console.error('Failed to register service worker:', error)
                    throw error
                }
            }

            registerServiceWorker()
                .then((registration) => {

                    // Listen for service worker updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New service worker is available
                                    console.log('New service worker available')
                                    // You could show a notification to the user here
                                }
                            })
                        }
                    })
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error)

                    // Add debugging information
                    console.log('Current URL:', window.location.href)
                    console.log('Service Worker support:', 'serviceWorker' in navigator)
                    console.log('Push Manager support:', 'PushManager' in window)
                    console.log('Notification support:', 'Notification' in window)

                    // Try to fetch the service worker file directly for debugging
                    fetch('/sw.js')
                        .then(response => {
                            console.log('Service worker file fetch status:', response.status)
                            if (!response.ok) {
                                console.error('Service worker file not accessible:', response.statusText)
                            }
                        })
                        .catch(fetchError => {
                            console.error('Failed to fetch service worker file:', fetchError)
                        })
                })

            // Listen for messages from service worker
            navigator.serviceWorker.addEventListener('message', (event) => {
                console.log('Message from service worker:', event.data)

                if (event.data && event.data.type === 'CACHE_UPDATED') {
                    // Handle cache updates
                    console.log('Cache updated')
                }
            })
        }

        // Initialize push notifications
        initializePushNotifications()
    }, [initializePushNotifications])

    return <>{children}</>
}