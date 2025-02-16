"use client";

import { Mail } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-12 md:py-20">
      {/* Constrain width and center horizontally */}
      <div className="container mx-auto max-w-3xl px-4">
        {/* Card-style container matching your theme */}
        <div className="bg-card text-card-foreground rounded-lg shadow-md p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Contact Me
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground text-center mb-6">
            If you have any questions or want to get in touch, feel free to send
            me an email.
          </p>

          {/* Row with icon and mailto link */}
          <div className="flex justify-center items-center space-x-2">
            <Mail className="w-5 h-5" />
            <a
              href="mailto:ahmad.fatayerji2004@gmail.com"
              className="text-primary font-semibold text-lg md:text-xl hover:underline"
            >
              ahmad.fatayerji2004@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
