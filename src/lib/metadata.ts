import type { Metadata } from "next";
import { siteOrigin } from "@/lib/qr/validation";

export const siteName = "Ahmad FATAYERJI";
export const getSiteOrigin = siteOrigin;

// Match Next.js trailingSlash so canonical URLs do not redirect.
export function siteUrl(path: string) {
  return new URL(path, getSiteOrigin()).href;
}

export const publicPages = {
  "/": {
    title: "Ahmad FATAYERJI | Software Engineer in France",
    description:
      "Explore Ahmad FATAYERJI's software engineering portfolio, career experience, and projects. Based in France, building modern, performant applications.",
  },
  "/about/": {
    title: "About | Ahmad FATAYERJI",
    description:
      "Learn about Ahmad FATAYERJI, a software engineer based in France, and explore his programming languages, frameworks, tools, and technical skills.",
  },
  "/projects/": {
    title: "Projects | Ahmad FATAYERJI",
    description:
      "Browse software projects built and contributed to by Ahmad FATAYERJI, with project details, technologies, source code, and demos where available.",
  },
  "/contact/": {
    title: "Contact | Ahmad FATAYERJI",
    description:
      "Contact Ahmad FATAYERJI by email or connect on LinkedIn and GitHub to discuss software engineering, projects, and collaboration opportunities.",
  },
} as const;

export function pageMetadata(path: keyof typeof publicPages): Metadata {
  const { title, description } = publicPages[path];
  return {
    title,
    description,
    alternates: { canonical: siteUrl(path) },
    openGraph: {
      type: "website",
      siteName,
      locale: "en_US",
      title,
      description,
      url: siteUrl(path),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

// Empty image lists override file-based images inherited from the root segment.
export const privatePageMetadata: Metadata = {
  description: null,
  alternates: { canonical: null },
  robots: { index: false, follow: false },
  openGraph: { images: [] },
  twitter: { images: [] },
};
