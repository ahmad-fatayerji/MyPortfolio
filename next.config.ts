import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/projects/index.txt",
        destination: "/projects",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
