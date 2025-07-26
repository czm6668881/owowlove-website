/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost', 'owowlove.vercel.app', 'owowlove.com', 'www.owowlove.com', 'lh3.googleusercontent.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/image/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/api/image/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'owowlove.com',
        pathname: '/api/image/**',
      },
      {
        protocol: 'https',
        hostname: 'owowlove.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.owowlove.com',
        pathname: '/api/image/**',
      },
      {
        protocol: 'https',
        hostname: 'www.owowlove.com',
        pathname: '/uploads/**',
      },
      // Google用户头像支持
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  // Vercel specific optimizations
  serverExternalPackages: ['bcryptjs', 'jsonwebtoken'],
  // Static file serving
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
      {
        source: '/product-images/:path*',
        destination: '/api/uploads/product-images/:path*',
      },
    ];
  },
}

export default nextConfig
