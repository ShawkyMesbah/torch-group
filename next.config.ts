import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during production builds for now
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
