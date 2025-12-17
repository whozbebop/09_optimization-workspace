import type { Metadata } from "next";
import { Noto_Sans_KR, Playfair_Display, Roboto_Mono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "이미지 & 폰트 최적화",
  description: "최적화를 통해 성능을 개선하세요.",
};

/*
  최적화 : next/font/google 로 Google Fonts 최적화
  - 빌드 시점에 폰트 다운로드 => 정적 assets (런타임 네트워크 요청 없음)
    => Self-Hosting
  - FOIT/FOUT 방지

*/

// Noto Sans KR 구글 폰트 객체 생성
const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"], // 웹폰트 서브셋(글꼴에 포함할 문자 집합) 지정
  weight: ["400", "700"], // 폰트 굵기
  display: "swap", // FOUT 방지(시스템 폰트에서 커스텀 폰트로 자연스러운 전환) + 성능 개선
  variable: "--font-noto-sans-kr", // CSS에서 var(--font-noto-sans-kr)로 접근 가능
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-playfair-display",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-roboto-monoe",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* ⚠️ 최적화 안됨: 외부 CDN에서 폰트 로드 - 렌더링 블로킹 발생 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&family=Playfair+Display:wght@400;700;900&family=Roboto+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={` ${notoSansKR.variable} ${playfairDisplay.variable} ${robotoMono.variable} antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
