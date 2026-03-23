import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { dev, isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    // 개발 모드에서 hydration 에러 무시
    if (dev && !isServer) {
      config.devtool = 'source-map';
    }

    return config;
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // 개발 모드 설정
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
  // onDemandEntries 설정
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
