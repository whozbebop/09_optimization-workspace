import { getPosts } from "@/post.service";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.example.com"; // 실제배포할도메인주소 로 변경

  // 1. 정적페이지 (/(홈), /blog(블로그), /about(소개))
  const staticPages = [
    {
      url: `${baseUrl}/`, // 실제배포할도메인주소 로 변경
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`, // 실제배포할도메인주소 로 변경
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`, // 실제배포할도메인주소 로 변경
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // 2. 동적 페이지
  const blogPosts = await getPosts();
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`, // 실제배포할도메인주소 로 변경
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages]; // 정적 페이지와 동적 페이지 합치기
}
