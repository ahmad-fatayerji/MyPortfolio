import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //output: 'export',
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/projects/index.txt',
        destination: '/projects',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
