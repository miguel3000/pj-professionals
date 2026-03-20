"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "WMO-zorg", href: "/wmo-zorg" },
  { label: "Forensische zorg", href: "/forensische-zorg" },
  { label: "Voor verwijzers", href: "/voor-verwijzers" },
  { label: "Over ons", href: "/over-ons" },
  { label: "Vacatures", href: "/vacatures" },
  { label: "FAQ", href: "/veelgestelde-vragen" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-white/10 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="flex items-center justify-between h-20 overflow-visible">
          {/* Logo */}
          <Link href="/" className="flex items-center group shrink-0 relative z-10">
            <Image
              src="/logo.png"
              alt="PJ Professionals"
              width={280}
              height={84}
              className="h-24 w-auto brightness-0 invert drop-shadow-lg"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-white/80 hover:text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-all whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-3 px-5 py-2.5 bg-white text-navy font-semibold text-sm rounded-lg hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="lg:hidden pb-6 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-white/80 hover:text-white text-base font-medium rounded-lg hover:bg-white/10 transition-all"
              >
                Home
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-white/80 hover:text-white text-base font-medium rounded-lg hover:bg-white/10 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 mx-4 px-5 py-3 bg-white text-navy font-semibold text-base rounded-lg hover:bg-white/90 transition-colors text-center"
              >
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
