import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10MB",
    },
  },
  images: {
    remotePatterns: [
      // {hostname: '*.googleusercontent.com', protocol: 'https', port: '503'},
      { hostname: "*.googleusercontent.com" },
      { hostname: "*.githubusercontent.com" },
      { hostname: "*.pstatic.net" },
      { hostname: "*.kakaocdn.net" },
      { hostname: "sbm.topician.com" },
      { hostname: "localhost", port: "3000" },
    ],
  },
};

export default nextConfig;
