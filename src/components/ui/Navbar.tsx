"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background text-foreground shadow-lg z-50">
      <div className="flex items-center justify-between p-4 w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold whitespace-nowrap">
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
          <Link href="/contact" className="hover:text-primary transition">
            Contact
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-background shadow-md p-4 space-y-3 text-center">
          <Link
            href="/"
            className="block hover:text-primary transition"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/projects"
            className="block hover:text-primary transition"
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
          <Link
            href="/contact"
            className="block hover:text-primary transition"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
