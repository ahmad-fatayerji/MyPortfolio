import type { ReactNode } from "react";
import { privatePageMetadata } from "@/lib/metadata";

export const metadata = privatePageMetadata;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
