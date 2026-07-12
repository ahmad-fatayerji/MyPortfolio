"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { LazyMotion, domAnimation } from "framer-motion";
import { ReactNode } from "react";
import { detectAppleMobileWebKit } from "@/lib/useIsAppleMobileWebKit";

export function ThemeProvider({ children }: { children: ReactNode }) {
  React.useEffect(() => {
    const { documentElement } = document;

    documentElement.classList.toggle("ios-safari", detectAppleMobileWebKit());

    return () => {
      documentElement.classList.remove("ios-safari");
    };
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      enableColorScheme={true}
      disableTransitionOnChange
    >
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </NextThemesProvider>
  );
}
