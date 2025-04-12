"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Github } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-10"
      >
        Get in Touch
      </motion.h1>

      <div className="glow-card border rounded-2xl px-6 py-8 sm:p-10 bg-background text-foreground shadow-md transition-colors space-y-6">
            <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="text-muted-foreground text-center text-sm sm:text-base"
        >
        Let&apos;s connect! Feel free to reach out.
        </motion.p>

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center sm:items-center gap-4 sm:gap-6 min-h-[64px]"
        >

          {/* Email */}
          <a
            href="mailto:ahmad.fatayerji2004@gmail.com"
            className="flex items-center gap-2 text-primary hover:underline transition-all text-sm sm:text-base"
          >
            <Mail className="w-5 h-5" />
            <span>ahmad.fatayerji2004@gmail.com</span>
          </a>

          {/* Divider */}
          <span className="hidden sm:block w-px h-6 bg-border" />

          {/* LinkedIn */}
          <Link
            href="https://www.linkedin.com/in/ahmad-fatayerji"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline transition-all text-sm sm:text-base"
          >
            <Linkedin className="w-5 h-5" />
            <span>LinkedIn</span>
          </Link>

          {/* Divider */}
          <span className="hidden sm:block w-px h-6 bg-border" />

          {/* GitHub */}
          <Link
            href="https://github.com/ahmad-fatayerji"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline transition-all text-sm sm:text-base"
          >
            <Github className="w-5 h-5" />
            <span>GitHub</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
