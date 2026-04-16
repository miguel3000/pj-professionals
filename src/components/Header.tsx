"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "WMO-zorg", href: "/wmo-zorg" },
  { label: "Forensische zorg", href: "/forensische-zorg" },
  { label: "WLZ-zorg", href: "/wlz-zorg" },
  { label: "Voor verwijzers", href: "/voor-verwijzers" },
  { label: "Over ons", href: "/over-ons" },
  { label: "Vacatures", href: "/vacatures" },
  { label: "FAQ", href: "/veelgestelde-vragen" },
  { label: "Documenten", href: "/documenten" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-white/10 bg-teal-dark/95 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="flex items-center justify-between h-20 overflow-visible">
          {/* Small logo on inner pages */}
          {!isHomepage && (
            <Link href="/" className="flex items-center group shrink-0 relative z-10">
              <Image
                src="/logo.png"
                alt="PJ Professionals"
                width={500}
                height={500}
                className="h-24 w-auto brightness-0 invert drop-shadow-lg mt-[75px]"
                priority
              />
            </Link>
          )}

          {/* Hamburger — always visible at every breakpoint */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg transition-colors ml-auto text-white hover:bg-white/10"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav className="pb-6 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-base font-medium rounded-lg transition-all text-white/80 hover:text-white hover:bg-white/10"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 mx-4 px-5 py-3 font-semibold text-base rounded-lg transition-colors text-center bg-white text-teal-dark hover:bg-white/90"
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
