import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for development performance
  reactStrictMode: true,
  
  // Enable SWC minification for faster builds
  swcMinify: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // Experimental features for better performance
  experimental: {
    // Enable Turbopack for faster development builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    
    // Optimize package imports
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      '@tanstack/react-table',
    ],
  },
  
  // Webpack configuration optimizations
  webpack: (config, { dev, isServer }) => {
    // Only in development
    if (dev) {
      // Disable type checking in development (use IDE instead)
      config.plugins = config.plugins.filter(
        (plugin: any) => plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin'
      );
    }
    
    return config;
  },
  
  // Ignore TypeScript errors during build (fix them separately)
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // Ignore ESLint during builds (run separately)
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
};

// Sentry configuration with performance optimizations
const sentryWebpackPluginOptions = {
  org: "nick-yf",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  
  // Reduce source map upload for faster builds in development
  widenClientFileUpload: process.env.NODE_ENV === 'production',
  
  tunnelRoute: "/monitoring",
  
  // Enable source maps only in production
  sourcemaps: {
    disable: process.env.NODE_ENV === 'development',
  },
  
  disableLogger: true,
  automaticVercelMonitors: true,
  
  // Skip Sentry in development for faster builds
  dryRun: process.env.NODE_ENV === 'development',
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);