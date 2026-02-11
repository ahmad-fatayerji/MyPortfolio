import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";

import Navbar from "@/components/ui/Navbar";

import "../styles/global.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ahmad FATAYERJI",
  description: "Ahmad FATAYERJI - Software Engineer based in France",
  icons: {
    icon: "/af_logo.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-background text-foreground antialiased ${inter.variable} font-sans`}
      >
        <ThemeProvider>
          {/* Animated gradient background */}
          <div className="gradient-mesh" />
          <div className="noise-overlay" />

          <div className="relative flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 pt-24 pb-12 max-w-6xl">
              {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-border/40 py-8">
              <div className="container mx-auto px-6 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()}{" "}
                  <span className="font-medium text-foreground">
                    Ahmad FATAYERJI
                  </span>
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
