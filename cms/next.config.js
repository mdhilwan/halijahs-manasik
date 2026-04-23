/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    images: {
        unoptimized: true
    },
    eslint: {
        dirs: ['app', 'lib'],
        ignoreDuringBuilds: true,
    }
}

module.exports = nextConfig
