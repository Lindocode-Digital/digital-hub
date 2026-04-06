import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dawn-unit-97b0.sdrowvieli1.workers.dev",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/projects",
        destination: "https://projects-rho-tan.vercel.app/projects",
      },
      {
        source: "/projects/:path*",
        destination: "https://projects-rho-tan.vercel.app/projects/:path*",
      },
      {
        source: "/lazyappz",
        destination: "https://lazy-appz.vercel.app/lazyappz",
      },
      {
        source: "/lazyappz/:path*",
        destination: "https://projects-rho-tan.vercel.app/lazyappz/:path*",
      },
    ];
  },
};

export default nextConfig;
