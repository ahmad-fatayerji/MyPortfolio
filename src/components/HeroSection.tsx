"use client";

import { Github, Linkedin } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-16 px-4 bg-background text-foreground transition-colors duration-300 ease-in-out">
      {/* Main Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-3">
        Hi, I’m Ahmad FATAYERJI
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl text-base md:text-lg text-muted-foreground mb-8">
        Welcome to my personal website! I’m a developer passionate about
        building modern apps and creative projects.
      </p>

      {/* Social Icons + Download CV */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        {/* GitHub */}
        <a
          href="https://github.com/ahmad-fatayerji"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors duration-300 ease-in-out"
          aria-label="GitHub"
        >
          <Github className="w-6 h-6" />
        </a>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/ahmad-fatayerji/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors duration-300 ease-in-out"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-6 h-6" />
        </a>

        {/* Download CV button */}
        <a
          href="/Ahmad_FATAYERJI_CV.pdf"
          download
          className="inline-block bg-primary text-primary-foreground py-2 px-5 rounded-md font-medium hover:bg-primary/90 transition-colors duration-300 ease-in-out"
        >
          Download My CV
        </a>
      </div>
    </section>
  );
}
