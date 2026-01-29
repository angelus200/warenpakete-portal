/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@warenpakete/types'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'brands-wanted.com',
      },
    ],
  },
};

module.exports = nextConfig;
