/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com'], // For Google profile images
    },
    experimental: {
        optimizePackageImports: ['@heroicons/react'],
    },
};

module.exports = nextConfig;