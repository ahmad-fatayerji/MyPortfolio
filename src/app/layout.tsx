import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

import "./globals.css";

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
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="flex flex-col min-h-screen">
          {/* Header Section */}
          <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto flex items-center justify-between p-4">
              <h1 className="text-2xl font-bold tracking-tight">
                Ahmad FATAYERJI
              </h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 container mx-auto p-6">{children}</main>

          {/* Footer Section */}
          <footer className="bg-white dark:bg-gray-800 text-center p-4">
            <p className="text-sm font-mono">
              © 2025 Ahmad FATAYERJI. All rights reserved.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
