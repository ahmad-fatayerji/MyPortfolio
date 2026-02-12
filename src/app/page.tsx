"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";

// Lazy load below-the-fold components to reduce initial bundle size
const CareerTimeline = dynamic(() => import("@/components/CareerTimeline"), {
  loading: () => (
    <div className="py-16 sm:py-24 flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  ),
  ssr: true,
});

export default function MainPage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      <CareerTimeline />
    </>
  );
}
