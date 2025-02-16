"use client";

import HeroSection from "@/components/HeroSection";

export default function WorkInProgress() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Work in Progress Section */}
      <div className="flex items-center justify-center min-h-screen text-foreground">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold animate-pulse">
            Work in Progress 🚧
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            This website is still under development, everything here is subject
            to change, check back soon!
          </p>
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <div className="w-4 h-4 bg-primary rounded-full animate-bounce" />
              <div className="w-4 h-4 bg-primary rounded-full animate-bounce [animation-delay:200ms]" />
              <div className="w-4 h-4 bg-primary rounded-full animate-bounce [animation-delay:400ms]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
