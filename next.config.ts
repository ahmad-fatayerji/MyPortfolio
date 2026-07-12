import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: true,
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.1.4"],

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

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

  // Add cache headers for static assets
  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [
        {
          source: "/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "no-store, max-age=0",
            },
          ],
        },
      ];
    }

    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:all*(woff|woff2|ttf|otf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [{ source: "/projects/index.txt", destination: "/projects", permanent: true }];
  }
};

export default nextConfig;
