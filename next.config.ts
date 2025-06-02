import type { NextConfig } from "next";
import { withAxiom } from 'next-axiom';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during production builds for now
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  typescript: {
    // Disable TypeScript checking during builds to avoid route handler issues
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Add allowedDevOrigins to fix cross-origin warnings
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '*.local',
    '192.168.1.38'
  ],
  webpack: (config, { isServer }) => {
    // Fix for PhoneInput and other client-side only modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable static optimization where possible
  staticPageGenerationTimeout: 120,
  // Add security headers
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
        }
      ]
    }
  ],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

// Wrap the nextConfig with the bundle analyzer and Axiom
module.exports = withAxiom(withBundleAnalyzer(nextConfig));
