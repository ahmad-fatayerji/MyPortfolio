import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import Navbar from "@/components/ui/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

import "@/styles/global.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ahmad FATAYERJI",
  description: "Ahmad FATAYERJI - Developer in France",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${inter.variable}`}
      >
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 container mx-auto p-6 mt-20">
              {children}
            </main>
            <footer className="bg-card text-card-foreground text-center p-4 rounded-t-2xl shadow-md">
              <p className="text-sm font-mono">
                © 2025 Ahmad FATAYERJI. All rights reserved.
              </p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
