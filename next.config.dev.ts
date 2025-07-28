import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Basic configuration for development
  reactStrictMode: true,
  swcMinify: true,
  
  // Disable type checking and linting during development builds
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Experimental features for faster development
  experimental: {
    // Enable Turbopack for much faster development builds
    // turbo: {},
    
    // Optimize specific package imports
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
    ],
  },
};

export default nextConfig;