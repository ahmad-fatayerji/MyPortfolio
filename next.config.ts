import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  trailingSlash: true,
  webpack: (config) => {
    // Explicitly set the alias for '@' to point to the 'src' folder
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
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
