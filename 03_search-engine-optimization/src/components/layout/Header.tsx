"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    // ❌ SEO 문제: header 태그 대신 div 사용
    <header className="border-b bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* ❌ SEO 문제: 로고에 h1 사용 (잘못된 관행) */}
        <div className="text-2xl font-bold text-blue-600">
          <Link href="/">DevBlog</Link>
        </div>

        {/* ❌ SEO 문제: nav 태그 없이 div로 메뉴 구성 */}
        <nav className="flex gap-6">
          {/* ❌ SEO 문제: button으로 페이지 이동 (크롤러가 못 따라감) */}

          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            홈
          </Link>
          <Link
            href="/blog"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            블로그
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            소개
          </Link>
        </nav>
      </div>
    </header>
  );
}
