import { getPostById, getPosts } from "@/post.service";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";


export async function generateMetadata({ params }: { params: Promise<{id: string}> }): Promise<Metadata> {

  const postId = (await params).id;
  const post = await getPostById(postId);

  if(!post){
    return {
      title: "포스트를 찾을 수 없습니다."
    }
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
          alt: post.title
        }
      ]
    }
  }


}

export async function generateStaticParams() { // 빌드 시점에 자동으로 실행됨 
  const blogPosts = await getPosts(); // BlogPost[] 
  return blogPosts.map((post) => ({
    id: post.id
  })) // [{id: "1"}, {id: "2"}, ...] => 서버컴포넌트의 params 속성으로 전달
}



export default async function BlogPostPage({ params }: { params: Promise<{id: string}> }) {

  const postId = (await params).id;
  const post = await getPostById(postId);
  const blogPosts = await getPosts();

  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            포스트를 찾을 수 없습니다
          </h1>
          <Link
            href="/blog"
            className="text-blue-600 hover:underline"
          >
            블로그로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.imageUrl,  
    "author": {
      "@type": "Person",
      "name": post.author
    },  
    "publisher": {
      "@type": "Organization",
      "name": "DevBlog",
      "logo": {
        "@type": "ImageObject",
        "url": "/images/logo.png"
      }
    },
    "datePublished": post.date
  }

  return (
    <>
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <article>
          <div className="flex items-center gap-4 mb-6 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 font-medium rounded-full">
              {post.category}
            </span>
            <span className="text-gray-500">{post.date}</span>
            <span className="text-gray-500">{post.readTime}</span>
            <span className="text-gray-500">작성자: {post.author}</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          <h2 className="text-xl text-gray-600 mb-8">
            {post.excerpt}
          </h2>

          <div className="w-full h-96 rounded-lg overflow-hidden mb-8 relative">
            <Image
              src={post.imageUrl}
              alt={`${post.title} 포스트의 대표 이미지`}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <div key={index} className="mb-4 text-gray-800 leading-relaxed">
                {paragraph.trim()}
              </div>
            ))}
          </div>

          {/* ❌ SEO 문제: 태그를 의미 없는 div로 표시 */}
          <footer className="mt-8 pt-8 border-t">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              태그
            </h3>
            <ul className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          </footer>
        </article>


        {/* ❌ SEO 문제: 관련 포스트를 button으로 링크 */}
        <aside className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            다른 포스트 보기
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts
              .filter(p => p.id !== post.id)
              .slice(0, 2)
              .map((relatedPost) => (
                <article
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
                  <Link
                    href={`/blog/${relatedPost.id}`}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    읽어보기 →
                  </Link>
                </article>
              ))}
          </div>
        </aside>
        
      </main>
    </>
  );
}

