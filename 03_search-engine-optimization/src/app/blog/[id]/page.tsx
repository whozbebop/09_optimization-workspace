import { getPostById, getPosts } from "@/post.service";
import { Metadata } from "next";
import Link from "next/link";

// ❌ SEO 문제 1: 동적 메타데이터 누락
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const postId = (await params).id;
  const post = await getPostById(postId);

  if (!post) {
    return {
      title: "포스트를 찾을 수 없습니다",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    keywords: post.tags,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
          alt: `${post.title} 이미지`,
        },
      ],
    },
  };
}

// ❌ SEO 문제 2: generateStaticParams 없음 (정적 생성 X)
// 빌드 시점에 자동으로 실행됨
export async function generateStaticParams() {
  const blogPosts = await getPosts(); // BlogPost[] 반환
  blogPosts.map((post) => {
    id: post.id;
  }); // [{id: "1"}, {id: "2"}, ...] => 서버컴포넌트의 paramas 속성으로 전달
}

// ❌ SEO 문제 3: JSON-LD 구조화 데이터 없음

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const postId = (await params).id;
  const post = await getPostById(postId);
  const blogPosts = await getPosts();

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-4">
            포스트를 찾을 수 없습니다
          </div>
          <Link href="/blog" className="text-blue-600 hover:underline">
            블로그로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ❌ SEO 문제: main 태그 대신 div 사용 */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* ❌ SEO 문제: article 태그 없이 div로만 구성 */}
        <div>
          <div className="flex items-center gap-4 mb-6 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 font-medium rounded-full">
              {post.category}
            </span>
            <span className="text-gray-500">{post.date}</span>
            <span className="text-gray-500">{post.readTime}</span>
            <span className="text-gray-500">작성자: {post.author}</span>
          </div>

          {/* ❌ SEO 문제: h1이 여러 개 (페이지당 1개만 있어야 함) */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          {/* ❌ SEO 문제: 또 다른 h1 (중복) */}
          <h2 className="text-xl text-gray-600 mb-8">{post.excerpt}</h2>

          <div className="w-full h-96 rounded-lg overflow-hidden mb-8">
            {/* ❌ SEO 문제: img 태그에 alt 누락 */}
            <img src={post.imageUrl} className="object-cover" />
          </div>

          {/* ❌ SEO 문제: 콘텐츠를 div로만 감싸고 시맨틱 의미 없음 */}
          <div className="prose prose-lg max-w-none">
            {post.content.split("\n").map((paragraph, index) => (
              <div key={index} className="mb-4 text-gray-800 leading-relaxed">
                {paragraph.trim()}
              </div>
            ))}
          </div>

          {/* ❌ SEO 문제: 태그를 의미 없는 div로 표시 */}
          <div className="mt-8 pt-8 border-t">
            <div className="text-sm font-semibold text-gray-900 mb-3">태그</div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* ❌ SEO 문제: 관련 포스트를 button으로 링크 */}
          <div className="mt-12 pt-8 border-t">
            <div className="text-2xl font-bold text-gray-900 mb-6">
              다른 포스트 보기
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts
                .filter((p) => p.id !== post.id)
                .slice(0, 2)
                .map((relatedPost) => (
                  <div
                    key={relatedPost.id}
                    className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-sm text-blue-600 font-medium mb-2">
                      {relatedPost.category}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mb-2">
                      {relatedPost.title}
                    </div>
                    <div className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {relatedPost.excerpt}
                    </div>
                    {/* ❌ SEO 문제: button으로 페이지 이동 */}
                    <Link
                      href={`/blog/${relatedPost.id}`}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      읽어보기 →
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
