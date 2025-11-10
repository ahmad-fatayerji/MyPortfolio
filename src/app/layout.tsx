import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";

import Navbar from "@/components/ui/Navbar";
// import ContactSection from "@/components/ContactSection"; legacy contact section

import "@/styles/global.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ahmad FATAYERJI",
  description: "Ahmad FATAYERJI - Developer in France",
  icons: {
    icon: "/af_logo.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // Suppress hydration warning because next-themes mutates <html> class/style on client
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${inter.variable}`}
      >
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            {/* Global Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 container mx-auto p-6 mt-20">
              {children}
            </main>

            {/* <ContactSection /> */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
