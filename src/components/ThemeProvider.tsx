"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light" //TO DO will be light for now and will have to change to default once both themes work properly
      enableSystem={true}
    >
      {children}
    </NextThemesProvider>
  );
}
