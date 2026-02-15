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
      {
        protocol: 'https',
        hostname: 'windelbaer.com',
      },
      {
        protocol: 'https',
        hostname: 'fitness-leben.com',
      },
      {
        protocol: 'https',
        hostname: 'www.fitness-leben.com',
      },
    ],
  },
};

module.exports = nextConfig;
