"use client";

import { Mail } from "lucide-react";

export default function ContactSection() {
  return (
    <footer
      id="contact"
      // Added "border" class so "border-muted-foreground" applies properly
      className="w-full py-4 md:py-6 bg-card text-card-foreground rounded-3xl border border-muted-foreground"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        {/* Contact Bar with Rounded Background */}
        <div className="w-full max-w-3xl mx-auto bg-muted/80 backdrop-blur-lg rounded-full py-3 px-6 flex flex-col md:flex-row items-center justify-between shadow-md">
          {/* Contact Text */}
          <p className="text-sm md:text-base text-muted-foreground text-center md:text-left">
            Let&apos;s connect! Feel free to reach out.
          </p>

          {/* Email Link with Icon */}
          <a
            href="mailto:ahmad.fatayerji2004@gmail.com"
            className="flex items-center space-x-2 text-primary font-medium text-sm md:text-base hover:underline transition-all"
          >
            <Mail className="w-4 h-4 md:w-5 md:h-5" />
            <span>ahmad.fatayerji2004@gmail.com</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
