import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/contact/");

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
