import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/digitalhub",
  assetPrefix: "/digitalhub",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      {
        protocol: "https",
        hostname: "dawn-unit-97b0.sdrowvieli1.workers.dev",
      },
      {
        protocol: "https",
        hostname: "objectstorage.ca-montreal-1.oraclecloud.com",
      },
    ],
  },
};

export default nextConfig;
