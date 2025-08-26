import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/penginapan/:slug",
        destination: "/property/:slug",
        permanent: true, // 301
      },
    ];
  },
};

export default nextConfig;
