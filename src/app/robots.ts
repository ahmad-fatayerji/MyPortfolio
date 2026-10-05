import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Allow crawling admin/testing so crawlers can read their noindex tags.
      // QR redirect responses already carry X-Robots-Tag: noindex.
      disallow: ["/qr/", "/api/"],
    },
    sitemap: siteUrl("/sitemap.xml"),
  };
}
