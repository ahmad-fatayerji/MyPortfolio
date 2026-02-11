"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Send, ExternalLink } from "lucide-react";
import Link from "next/link";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "ahmad.fatayerji2004@gmail.com",
    href: "mailto:ahmad.fatayerji2004@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "ahmad-fatayerji",
    href: "https://www.linkedin.com/in/ahmad-fatayerji",
    external: true,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "ahmad-fatayerji",
    href: "https://github.com/ahmad-fatayerji",
    external: true,
    actionIcon: ExternalLink,
  },
];

export default function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto py-8 sm:py-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="section-heading mb-4">
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Have a question or want to work together? I&apos;d love to hear from
          you.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        {contactLinks.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          >
            <Link
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="glass-card gradient-border flex items-center gap-4 p-5 group"
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                  {item.label}
                </p>
                <p className="text-sm font-medium truncate">{item.value}</p>
              </div>
              {item.actionIcon ? (
                <item.actionIcon className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
              ) : (
                <Send className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
              )}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
