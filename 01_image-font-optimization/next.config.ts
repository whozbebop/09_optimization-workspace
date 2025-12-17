import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    //deviceSizes: [640, 768, 1024, 1280, ...],
    qualities: [75, 80],
  },
};

export default nextConfig;
