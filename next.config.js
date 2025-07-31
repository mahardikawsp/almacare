const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    fallbacks: {
        document: '/offline',
        image: '/icons/icon-192x192.png',
        audio: '/offline',
        video: '/offline',
        font: '/offline'
    },
    runtimeCaching: [
        // Google Fonts
        {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-fonts',
                expiration: {
                    maxEntries: 4,
                    maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
                }
            }
        },
        {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-fonts-static',
                expiration: {
                    maxEntries: 4,
                    maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
                }
            }
        },
        // Static assets
        {
            urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'static-image-assets',
                expiration: {
                    maxEntries: 64,
                    maxAgeSeconds: 24 * 60 * 60 // 24 hours
                }
            }
        },
        {
            urlPattern: /\.(?:js|css|woff|woff2|ttf|eot)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'static-resources',
                expiration: {
                    maxEntries: 32,
                    maxAgeSeconds: 24 * 60 * 60 // 24 hours
                }
            }
        },
        // App pages - cache for offline access
        {
            urlPattern: /^\/(?:dashboard|children|growth|mpasi|immunization|reports).*$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'app-pages',
                expiration: {
                    maxEntries: 20,
                    maxAgeSeconds: 60 * 60 // 1 hour
                }
            }
        },
        // API routes - prioritize network but cache for offline
        {
            urlPattern: /^\/api\/children.*/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api-children',
                expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 15 * 60 // 15 minutes
                },
                networkTimeoutSeconds: 10
            }
        },
        {
            urlPattern: /^\/api\/growth.*/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api-growth',
                expiration: {
                    maxEntries: 20,
                    maxAgeSeconds: 15 * 60 // 15 minutes
                },
                networkTimeoutSeconds: 10
            }
        },
        {
            urlPattern: /^\/api\/immunization.*/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api-immunization',
                expiration: {
                    maxEntries: 20,
                    maxAgeSeconds: 15 * 60 // 15 minutes
                },
                networkTimeoutSeconds: 10
            }
        },
        {
            urlPattern: /^\/api\/mpasi.*/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api-mpasi',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 // 1 hour (recipes don't change often)
                },
                networkTimeoutSeconds: 10
            }
        },
        // Other API routes
        {
            urlPattern: /^\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api-cache',
                expiration: {
                    maxEntries: 16,
                    maxAgeSeconds: 5 * 60 // 5 minutes
                },
                networkTimeoutSeconds: 10
            }
        }
    ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com'], // For Google profile images
    },
    experimental: {
        optimizePackageImports: ['@heroicons/react'],
    },
};

module.exports = withPWA(nextConfig);