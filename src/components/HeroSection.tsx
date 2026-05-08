"use client";

import { Github, Linkedin, ArrowDown, Download } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[85vh] text-center px-4">
      {/* Animated floating orbs */}
      <div
        className="absolute top-20 left-[15%] h-48 w-48 rounded-full opacity-20 blur-3xl pointer-events-none sm:h-72 sm:w-72"
        style={{
          background:
            "linear-gradient(135deg, hsl(262 83% 58%), hsl(190 95% 50%))",
        }}
      />
      <div
        className="absolute bottom-20 right-[10%] h-56 w-56 rounded-full opacity-15 blur-3xl pointer-events-none sm:h-96 sm:w-96"
        style={{
          background:
            "linear-gradient(135deg, hsl(190 95% 50%), hsl(262 83% 58%))",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl">
        {/* Name */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          Hi, I&apos;m <span className="gradient-text">Ahmad FATAYERJI</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Software engineer passionate about building modern, performant
          applications and crafting elegant digital experiences.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <a
            href="/Ahmad_FATAYERJI_CV.pdf"
            download
            className="btn-gradient gap-2"
          >
            <Download className="w-4 h-4" />
            Download CV
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold border border-border bg-card/50 backdrop-blur-sm md:hover:bg-card md:hover:border-primary/30 transition-all duration-300"
          >
            Get in Touch
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://github.com/ahmad-fatayerji"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-11 h-11 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
          <a
            href="https://www.linkedin.com/in/ahmad-fatayerji/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-11 h-11 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div>
          <ArrowDown className="w-5 h-5 text-muted-foreground/50" />
        </div>
      </div>
    </section>
  );
}
