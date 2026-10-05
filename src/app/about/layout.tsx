import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/about/");

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
