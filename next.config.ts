import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  trailingSlash: true,
  webpack: (config) => {
    // Explicitly add the alias so that "@" maps to your "src" folder
    config.resolve.alias["@"] = path.join(__dirname, "src");
    return config;
  },
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
