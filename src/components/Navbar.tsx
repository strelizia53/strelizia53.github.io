"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className={`header${scrolled ? " header-scrolled" : ""}`}>
      <div className="container nav">
        <Link href="/" className="brand">
          <span className="brand-icon">RK</span>
          <span className="brand-text">Rushaid Khan</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav" aria-label="Primary">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link${
                    pathname === link.href ? " nav-link-active" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="nav-cta">
                Get in Touch
              </Link>
            </li>
          </ul>
        </nav>

        <div className="nav-right">
          <ThemeToggle />
          {/* Mobile Menu Button */}
          {mounted && (
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mounted && menuOpen && (
        <nav className="mobile-nav fade-in" aria-label="Mobile Navigation">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    pathname === link.href ? "mobile-nav-active" : undefined
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="mobile-nav-cta"
                onClick={() => setMenuOpen(false)}
              >
                Get in Touch
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
