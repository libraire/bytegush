import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@libsql/client'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.imgur.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/product/:slug',
        destination: '/products/:slug',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    if (!process.env.NEXT_PUBLIC_API_HOST) {
      return [];
    }
    return [
      {
        source: '/hts/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_HOST}/hts/api/v1/:path*`,
      },
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
