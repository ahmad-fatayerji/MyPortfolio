import type { ReactNode } from "react";
import { privatePageMetadata } from "@/lib/metadata";

export const metadata = {
  ...privatePageMetadata,
  title: "Testing | Ahmad FATAYERJI",
};

export default function TestingLayout({ children }: { children: ReactNode }) {
  return children;
}
