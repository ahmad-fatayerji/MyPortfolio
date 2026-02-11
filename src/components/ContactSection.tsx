"use client";

import { Mail, ArrowUpRight } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="section-heading mb-4">
          Let&apos;s <span className="gradient-text">Connect</span>
        </h2>
        <p className="text-muted-foreground mb-8">
          Have an idea or just want to say hi? Drop me a line.
        </p>
        <a
          href="mailto:ahmad.fatayerji2004@gmail.com"
          className="btn-gradient gap-2 mx-auto"
        >
          <Mail className="w-4 h-4" />
          Get in Touch
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
