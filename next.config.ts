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
        destination: "https://projects-mu-six.vercel.app/projects",
      },
      {
        source: "/projects/:path*",
        destination: "https://projects-mu-six.vercel.app/projects/:path*",
      },
    ];
  },
};

export default nextConfig;
