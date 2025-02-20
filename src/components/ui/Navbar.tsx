"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsOpen(false);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background text-foreground shadow-lg z-50">
      <div className="flex items-center justify-between p-4 w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          Ahmad FATAYERJI
        </Link>

        {/* Mobile Menu Button & Theme Toggle */}
        <div className="flex items-center md:hidden space-x-4">
          <ThemeToggle />
          <button
            className="text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-primary transition">
            Home
          </Link>
          <Link href="/projects" className="hover:text-primary transition">
            Projects
          </Link>
          <a
            href="#contact"
            onClick={handleContactClick}
            className="hover:text-primary transition"
          >
            Contact
          </a>
          <ThemeToggle />
        </div>
      </div>

      {/* MOBILE FULL-SCREEN OVERLAY MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header Row (Logo + Close Button) */}
            <div className="flex items-center justify-between p-4">
              <Link
                href="/"
                className="text-2xl font-bold"
                onClick={() => setIsOpen(false)}
              >
                Ahmad FATAYERJI
              </Link>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <button
                  className="text-foreground"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Menu"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Links */}
            <motion.div
              className="flex-1 flex flex-col items-center justify-center space-y-6"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              exit={{ y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/"
                className="text-lg font-medium hover:text-primary transition"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>

              <Link
                href="/projects"
                className="text-lg font-medium hover:text-primary transition"
                onClick={() => setIsOpen(false)}
              >
                Projects
              </Link>

              <a
                href="#contact"
                className="text-lg font-medium hover:text-primary transition"
                onClick={handleContactClick}
              >
                Contact
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
