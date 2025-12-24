import { MetadataRoute } from "next";

// robots.txt 생성
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"], // 단, 특정 경로 수집 못하도록 설정
      },
    ],
    sitemap: "https://www.example.com/sitemap.xml", // 사이트맵 경로, 실제배포할도메인주소/sitemap.xml 로 변경
  };
}
