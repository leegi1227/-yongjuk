import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '건폐율/용적률 현황 조회',
  description: '2025년 기준 전국 도시 건폐율/용적률 현황 조회 시스템',
  keywords: ['건폐율', '용적률', '도시계획', '건축', '부동산'],
  authors: [{ name: '건폐율/용적률 조회 시스템' }],
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: '건폐율/용적률 현황 조회',
    title: '건폐율/용적률 현황 조회',
    description: '2025년 기준 전국 도시 건폐율/용적률 현황 조회 시스템',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // 콘솔 에러 필터링 - Hydration 관련 경고 숨기기
                if (typeof window !== 'undefined') {
                  const originalError = console.error;
                  console.error = function(...args) {
                    const firstArg = args[0];
                    // Hydration 관련 에러 메시지 필터링
                    if (
                      typeof firstArg === 'string' &&
                      (firstArg.includes('Hydration') ||
                       firstArg.includes('hydration') ||
                       firstArg.includes('did not match') ||
                       firstArg.includes('user-select'))
                    ) {
                      return; // 에러 메시지를 표시하지 않음
                    }
                    originalError.apply(console, args);
                  };

                  // 브라우저 확장 프로그램의 style 제거
                  const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const target = mutation.target;
                        if (target.style && target.style.userSelect === 'auto') {
                          target.style.userSelect = '';
                        }
                      }
                    });
                  });

                  // DOM이 로드된 후 모든 요소 감시
                  document.addEventListener('DOMContentLoaded', function() {
                    observer.observe(document.body, {
                      attributes: true,
                      attributeFilter: ['style'],
                      subtree: true
                    });

                    // 기존 style 속성 제거
                    document.querySelectorAll('[style*="user-select"]').forEach(function(el) {
                      if (el.style.userSelect === 'auto') {
                        el.style.userSelect = '';
                      }
                    });
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
