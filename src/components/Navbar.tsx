"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container nav">
        <Link href="/" className="brand">
          Strelizia53
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav" aria-label="Primary">
          <ul className="nav-list">
            <li>
              <Link href="/projects" className="nav-link">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/blog" className="nav-link">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/about" className="nav-link">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="nav-link">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <ThemeToggle />
      </div>

      {/* Mobile Nav Dropdown */}
      {menuOpen && (
        <nav className="mobile-nav fade-in" aria-label="Mobile Navigation">
          <ul>
            <li>
              <Link href="/projects" onClick={() => setMenuOpen(false)}>
                Projects
              </Link>
            </li>
            <li>
              <Link href="/blog" onClick={() => setMenuOpen(false)}>
                Blog
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
