import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // {hostname: '*.googleusercontent.com', protocol: 'https', port: 503},
      { hostname: "*.googleusercontent.com" },
      { hostname: "*.githubusercontent.com" },
      { hostname: "*.pstatic.net" },
      { hostname: "*.kakaocdn.net" },
      { hostname: "sbm.topician.com" },
      { hostname: "localhost" },
    ],
  },
};

export default nextConfig;
