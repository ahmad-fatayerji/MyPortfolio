"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-4xl bg-white shadow-lg rounded-2xl p-4 z-50">
      <div className="flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-bold text-blue-600 cursor-pointer">
            Ahmad FATAYERJI
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-500 transition"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className="text-gray-700 hover:text-blue-500 transition"
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-500 transition"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <ul className="mt-4 space-y-3 md:hidden text-center">
          <li>
            <Link
              href="/"
              className="block text-gray-700 hover:text-blue-500 transition"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className="block text-gray-700 hover:text-blue-500 transition"
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="block text-gray-700 hover:text-blue-500 transition"
            >
              Contact
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
