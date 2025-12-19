/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
    images: {
        domains: ['localhost'],
    },
    env: {
        NEXT_PUBLIC_APP_NAME: 'Motia Studio Pro',
        NEXT_PUBLIC_APP_VERSION: '1.0.0',
    },
}

module.exports = nextConfig
