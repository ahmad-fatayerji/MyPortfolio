"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4 w-full max-w-6xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold tracking-tight">
          Ahmad <span className="gradient-text">FATAYERJI</span>
        </Link>

        {/* Mobile Menu Button & Theme Toggle */}
        <div className="flex items-center md:hidden gap-3">
          <ThemeToggle />
          <button
            className="text-foreground p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 rounded-lg bg-primary/10 -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          <div className="ml-3 pl-3 border-l border-border/50">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-2xl flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4">
              <Link
                href="/"
                className="text-lg font-bold tracking-tight"
                onClick={() => setIsOpen(false)}
              >
                Ahmad <span className="gradient-text">FATAYERJI</span>
              </Link>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button
                  className="text-foreground p-1"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Menu"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Links */}
            <motion.div
              className="flex-1 flex flex-col items-center justify-center gap-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      className={`text-2xl font-semibold transition-colors ${
                        isActive
                          ? "gradient-text"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
