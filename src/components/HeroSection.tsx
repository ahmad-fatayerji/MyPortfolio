"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, ArrowDown, Download } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[85vh] text-center px-4 overflow-hidden">
      {/* Animated floating orbs */}
      <motion.div
        className="absolute top-20 left-[15%] w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, hsl(262 83% 58%), hsl(190 95% 50%))",
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, hsl(190 95% 50%), hsl(262 83% 58%))",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -20, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-3xl"
      >
        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          Hi, I&apos;m <span className="gradient-text">Ahmad FATAYERJI</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Software engineer passionate about building modern, performant
          applications and crafting elegant digital experiences.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
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
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold border border-border bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/30 transition-all duration-300"
          >
            Get in Touch
          </a>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex items-center justify-center gap-4"
        >
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
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-5 h-5 text-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
