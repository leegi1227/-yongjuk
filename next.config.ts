import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: '**',
      },
    ],
  },
  // 정적 사이트 생성(SSG)을 위한 설정
  output: 'export',
  trailingSlash: true,
  // 이미지 최적화 비활성화 (정적 export 시 필요)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
