import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/projects/");

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return children;
}
