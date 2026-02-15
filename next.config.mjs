/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.imgur.com'
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/hts/api/v1/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_HOST}/hts/api/v1/:path*`
            },
            {
                source: '/api/v1/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/:path*`
            }
        ]
    }
};

export default nextConfig;
