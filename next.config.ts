import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3007",
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "server.gravisindia.com",
        pathname: "/files/**",
      },
    ],
    // Allow images from localhost (resolves to 127.0.0.1) in development only
    // dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
