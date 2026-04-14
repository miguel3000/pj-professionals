"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
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
  const [homeOpen, setHomeOpen] = useState(false);
  const pathname = usePathname();
  const isHomepage2 = pathname === "/homepage-2";
  const isHomepage3 = pathname === "/homepage-3";

  // Theme variants — homepage-3 uses a light teal header
  const headerBg = isHomepage3
    ? "bg-teal-surface/95 border-teal-dark/10"
    : "bg-navy/95 border-white/10";
  const linkText = isHomepage3
    ? "text-teal-dark/80 hover:text-teal-dark hover:bg-teal-dark/10"
    : "text-white/80 hover:text-white hover:bg-white/10";
  const dropdownBg = isHomepage3
    ? "bg-teal-surface border-teal-dark/10"
    : "bg-navy border-white/10";
  const dropdownLinkText = isHomepage3
    ? "text-teal-dark/80 hover:text-teal-dark hover:bg-teal-dark/10"
    : "text-white/80 hover:text-white hover:bg-white/10";
  const ctaButton = isHomepage3
    ? "bg-teal-dark text-white hover:bg-teal-dark/90"
    : "bg-white text-navy hover:bg-white/90";
  const menuIconColor = isHomepage3 ? "text-teal-dark" : "text-white";
  const menuBorder = isHomepage3 ? "border-teal-dark/10" : "border-white/10";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b overflow-visible ${headerBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="flex items-center justify-between h-20 overflow-visible">
          {/* Standard logo (homepage-1, and all other pages except -2 and -3) */}
          {!isHomepage2 && !isHomepage3 && (
            <Link href="/" className="flex items-center group shrink-0 relative z-10">
              <Image
                src="/logo.png"
                alt="PJ Professionals"
                width={280}
                height={84}
                className="h-24 w-auto brightness-0 invert drop-shadow-lg mt-[75px]"
                priority
              />
            </Link>
          )}

          {/* Centered original logo for homepage-2 (extends below header) */}
          {isHomepage2 && (
            <div className="absolute left-1/2 -translate-x-1/2 top-3">
              <div className="bg-navy rounded-2xl p-[15px]">
                <Image
                  src="/logo.png"
                  alt="PJ Professionals"
                  width={800}
                  height={240}
                  className="h-64 w-auto brightness-0 invert drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          )}

          {/* Alternative logo (homepage-3) — tinted to teal, white bg blended via multiply */}
          {isHomepage3 && (
            <Link href="/homepage-3" className="flex items-center group shrink-0 relative z-10">
              <Image
                src="/logo-alt.jpg"
                alt="PJ Professionals"
                width={400}
                height={160}
                className="h-14 w-auto logo-tint-teal mix-blend-multiply"
                priority
              />
            </Link>
          )}

          {/* Desktop Navigation — hidden on homepage-2 (hamburger only) */}
          <nav
            className={`${isHomepage2 ? "hidden" : "hidden lg:flex"} items-center gap-0.5`}
          >
            {/* Temporary Home dropdown */}
            <div className="relative">
              <button
                onClick={() => setHomeOpen(!homeOpen)}
                onBlur={() => setTimeout(() => setHomeOpen(false), 150)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap inline-flex items-center gap-1 ${linkText}`}
              >
                Home
                <svg
                  className={`w-3 h-3 transition-transform ${homeOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {homeOpen && (
                <div
                  className={`absolute top-full left-0 mt-1 border rounded-lg shadow-xl py-1 min-w-[160px] ${dropdownBg}`}
                >
                  <Link
                    href="/"
                    className={`block px-4 py-2 text-sm transition-all ${dropdownLinkText}`}
                  >
                    Homepage 1
                  </Link>
                  <Link
                    href="/homepage-2"
                    className={`block px-4 py-2 text-sm transition-all ${dropdownLinkText}`}
                  >
                    Homepage 2
                  </Link>
                  <Link
                    href="/homepage-3"
                    className={`block px-4 py-2 text-sm transition-all ${dropdownLinkText}`}
                  >
                    Homepage 3
                  </Link>
                </div>
              )}
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${linkText}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className={`ml-3 px-5 py-2.5 font-semibold text-sm rounded-lg transition-colors whitespace-nowrap ${ctaButton}`}
            >
              Contact
            </Link>
          </nav>

          {/* Menu button — always visible on homepage-2, mobile-only elsewhere */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`${isHomepage2 ? "" : "lg:hidden"} p-2 rounded-lg transition-colors ml-auto ${menuIconColor} ${
              isHomepage3 ? "hover:bg-teal-dark/10" : "hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Slide-out menu — always available on homepage-2, mobile-only elsewhere */}
        {menuOpen && (
          <nav
            className={`${isHomepage2 ? "" : "lg:hidden"} pb-6 border-t pt-4 ${menuBorder}`}
          >
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 text-base font-medium rounded-lg transition-all ${linkText}`}
              >
                Homepage 1
              </Link>
              <Link
                href="/homepage-2"
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 text-base font-medium rounded-lg transition-all ${linkText}`}
              >
                Homepage 2
              </Link>
              <Link
                href="/homepage-3"
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 text-base font-medium rounded-lg transition-all ${linkText}`}
              >
                Homepage 3
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 text-base font-medium rounded-lg transition-all ${linkText}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className={`mt-2 mx-4 px-5 py-3 font-semibold text-base rounded-lg transition-colors text-center ${ctaButton}`}
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
