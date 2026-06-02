import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.nirvana.style",
        pathname: "/files/**",
      },
      {
        protocol: "http",
        hostname: "31.97.227.94",
        port: "3013",
        pathname: "/files/**",
      },
    ],
    // Allow images from localhost (resolves to 127.0.0.1) in development only
    // dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
