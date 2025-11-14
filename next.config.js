/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1rpi6kt0akbt7.cloudfront.net',
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
