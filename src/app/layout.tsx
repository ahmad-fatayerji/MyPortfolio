import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import Navbar from "@/components/ui/Navbar";

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
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="flex flex-col min-h-screen">
          {/* Navbar Section */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1 container mx-auto p-6 mt-20">{children}</main>

          {/* Footer Section */}
          <footer className="bg-gray-800 text-center p-4 rounded-t-2xl shadow-md">
            <p className="text-sm font-mono text-gray-300">
              © 2025 Ahmad FATAYERJI. All rights reserved.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
