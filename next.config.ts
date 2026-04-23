import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "deargynac.vercel.app",
        "*.vercel.app",
      ],
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.cloudflare.com" },
    ],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
