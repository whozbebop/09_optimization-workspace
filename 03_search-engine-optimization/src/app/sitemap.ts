import { getPosts } from "@/post.service";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const baseUrl = 'http://localhost:3000'

  // 1. 정적페이지 (/(홈), /blog(블로그), /about(소개))
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const, 
      priority: 1
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const, 
      priority: 0.9
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const, 
      priority: 0.5
    },
  ]

  // 2. 동적 페이지 
  const blogPosts = await getPosts();
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }))

  return [...staticPages, ...blogPages]

}
