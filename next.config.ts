import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Produce a self-contained runtime (server.js + minimal node_modules)
  // so the workflow can run "node server.js" with PM2.
  output: "standalone",

  // Keep your URLs with a trailing slash (as you had).
  trailingSlash: true,

  // If you want to reduce CPU usage and avoid optimizer hiccups behind a proxy,
  // leave this enabled. Remove it if you want Next's image optimization.
  // images: { unoptimized: true },

  // Helpful in prod to catch accidental side-effects.
  reactStrictMode: true,

  webpack: (config) => {
    // Alias '@' -> 'src' (as you had)
    config.resolve.alias["@" as any] = path.resolve(__dirname, "src");
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

  // If you ever need proxy/host awareness behind Apache:
  // experimental: { trustHostHeader: true },
};

export default nextConfig;
