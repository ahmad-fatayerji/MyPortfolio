"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 dark:text-gray-100"
        >
          Ahmad FATAYERJI
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
          >
            Home
          </Link>
          <Link
            href="/projects"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
          >
            Projects
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
          >
            Contact
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
