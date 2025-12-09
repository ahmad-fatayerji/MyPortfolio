import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: true,
  reactStrictMode: true,

  // Turbopack is default in Next 16
  turbopack: {
    // Map import specifier "@" to the src folder
    // so `import x from "@/foo/bar"` works.
    resolveAlias: {
      "@": "./src",
      // (Optional) if you prefer "@/..." style specifically:
      // "@/": "./src/"
    }
  },

  async redirects() {
    return [{ source: "/projects/index.txt", destination: "/projects", permanent: true }];
  }
};

export default nextConfig;
