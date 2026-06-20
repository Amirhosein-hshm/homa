import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${process.env.API_BASE_URL_SERVER || "http://127.0.0.1:8000"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
