import type { MetadataRoute } from "next";
import { publicPages, siteUrl } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.keys(publicPages).map((path) => ({ url: siteUrl(path) }));
}
