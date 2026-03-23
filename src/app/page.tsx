'use client';

import dynamic from 'next/dynamic';

// SSR을 완전히 비활성화하여 Hydration 오류 방지
// loading을 제거하여 서버 렌더링 완전 차단
const HomeContent = dynamic(() => import('@/components/home-content'), {
  ssr: false,
});

export default function Home() {
  return <HomeContent />;
}
