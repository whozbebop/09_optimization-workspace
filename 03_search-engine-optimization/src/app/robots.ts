import { MetadataRoute } from "next";

// robots.txt 생성
export default function robots(): MetadataRoute.Robots {
  

  return {
    rules: [
      {
        userAgent: '*', // 모든 봇(Google, Naver, Bing 등)
        allow: '/',     // 모든 경로 접근 허용
        disallow: ['/admin/', '/api/'] // 단, /admin/, .. 경로는 수집하지 마라
      }
    ],
    sitemap: `http://localhost:3000/sitemap.xml` // 사이트맵(sitemap.xml) 파일 경로
  }

}