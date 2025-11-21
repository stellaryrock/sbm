import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactStrictMode: false,
  experimental: {
    // [CanaryOnlyError: The experimental feature "experimental.ppr" can only be enabled when using the latest canary version of Next.js.]
    // ppr: "incremental",
    serverActions: {
      bodySizeLimit: "10MB",
    },
    typedEnv: true,
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
  typedRoutes: true,
};

export default nextConfig;
