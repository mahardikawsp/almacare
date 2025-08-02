// Service Worker for BayiCare PWA with Push Notifications
const CACHE_NAME = 'bayicare-v1'
const STATIC_ASSETS = [
    '/',
    '/dashboard',
    '/offline',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...')
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching static assets')
                return cache.addAll(STATIC_ASSETS)
            })
            .then(() => {
                console.log('Service Worker installed successfully')
                return self.skipWaiting()
            })
            .catch((error) => {
                console.error('Service Worker installation failed:', error)
            })
    )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...')
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName)
                            return caches.delete(cacheName)
                        }
                    })
                )
            })
            .then(() => {
                console.log('Service Worker activated successfully')
                return self.clients.claim()
            })
    )
})

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return
    }

    // Skip external requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    return cachedResponse
                }

                // Otherwise fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response
                        }

                        // Clone the response for caching
                        const responseToCache = response.clone()

                        // Cache the response for future use
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache)
                            })

                        return response
                    })
                    .catch(() => {
                        // Return offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('/offline')
                        }
                        return new Response('Offline', { status: 503 })
                    })
            })
    )
})

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
    console.log('Push notification received:', event)

    let notificationData = {
        title: 'BayiCare',
        body: 'Anda memiliki notifikasi baru',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        data: {},
        actions: [
            {
                action: 'open',
                title: 'Buka Aplikasi'
            },
            {
                action: 'close',
                title: 'Tutup'
            }
        ],
        requireInteraction: false,
        silent: false,
        vibrate: [200, 100, 200]
    }

    // Parse notification data if available
    if (event.data) {
        try {
            const data = event.data.json()
            notificationData = { ...notificationData, ...data }
        } catch (error) {
            console.error('Error parsing push notification data:', error)
        }
    }

    event.waitUntil(
        self.registration.showNotification(notificationData.title, {
            body: notificationData.body,
            icon: notificationData.icon,
            badge: notificationData.badge,
            data: notificationData.data,
            actions: notificationData.actions,
            requireInteraction: notificationData.requireInteraction,
            silent: notificationData.silent,
            vibrate: notificationData.vibrate,
            tag: notificationData.tag || 'bayicare-notification'
        })
    )
})

// Notification click event - handle user interaction with notifications
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event)

    event.notification.close()

    if (event.action === 'close') {
        return
    }

    // Default action or 'open' action
    const urlToOpen = event.notification.data?.url || '/'

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if there's already a window/tab open with the target URL
                for (const client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus()
                    }
                }

                // If no existing window/tab, open a new one
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen)
                }
            })
    )
})

// Background sync event - handle background synchronization
self.addEventListener('sync', (event) => {
    console.log('Background sync triggered:', event.tag)

    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Perform background sync operations
            syncData()
        )
    }
})

// Helper function for background sync
async function syncData() {
    try {
        // Sync any pending data when connection is restored
        console.log('Performing background sync...')

        // This could include syncing growth records, immunization updates, etc.
        // Implementation would depend on the specific sync requirements

        return Promise.resolve()
    } catch (error) {
        console.error('Background sync failed:', error)
        throw error
    }
}

// Message event - handle messages from the main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker received message:', event.data)

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting()
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME })
    }
})