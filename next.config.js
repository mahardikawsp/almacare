/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com'], // For Google profile images
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    experimental: {
        optimizePackageImports: ['@heroicons/react', 'recharts'],
    },
    // Performance optimizations
    compress: true,
    poweredByHeader: false,
    // Disable type checking during build
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Headers for PWA and service worker
    async headers() {
        return [
            {
                source: '/sw.js',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                    {
                        key: 'Service-Worker-Allowed',
                        value: '/',
                    },
                ],
            },

        ]
    },
    // Bundle analyzer in development
    ...(process.env.ANALYZE === 'true' && {
        webpack: (config, { isServer }) => {
            if (!isServer) {
                const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
                config.plugins.push(
                    new BundleAnalyzerPlugin({
                        analyzerMode: 'static',
                        openAnalyzer: false,
                    })
                )
            }
            return config
        }
    })
};

module.exports = nextConfig;