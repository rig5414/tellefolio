import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.103',
      }
    ],
  },
  reactStrictMode: true,
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.1.103:3000',
  ],
};

export default nextConfig;

// ... existing code ...
