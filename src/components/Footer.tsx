import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-teal-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="PJ Professionals"
                width={140}
                height={42}
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Wij blijven staan waar anderen afhaken. Professionele
              ondersteuning binnen de WMO en forensische zorg.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">
              Navigatie
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "WMO-zorg", href: "/wmo-zorg" },
                { label: "Forensische zorg", href: "/forensische-zorg" },
                { label: "Voor verwijzers", href: "/voor-verwijzers" },
                { label: "Over ons", href: "/over-ons" },
                { label: "Vacatures", href: "/vacatures" },
                { label: "Veelgestelde vragen", href: "/veelgestelde-vragen" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">
              Locaties
            </h3>
            <div className="space-y-4 text-sm text-white/60">
              <div>
                <p className="text-white/80 font-medium">&apos;s-Hertogenbosch</p>
                <p>Bruistensingel 130</p>
                <p>5232 AC &apos;s-Hertogenbosch</p>
              </div>
              <div>
                <p className="text-white/80 font-medium">Oss</p>
                <p>Raadhuishof 25</p>
                <p>5341 HR Oss</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:073-7621035" className="hover:text-white transition-colors">073 - 762 1035</a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:bureaudienst@pjprofessionals.nl" className="hover:text-white transition-colors">bureaudienst@pjprofessionals.nl</a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:aanmeldingen@pjprofessionals.nl" className="hover:text-white transition-colors">aanmeldingen@pjprofessionals.nl</a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Bel Saartje</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} PJ Professionals. Alle rechten
            voorbehouden.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/over-ons#privacy" className="text-white/40 hover:text-white text-sm transition-colors">
              Privacybeleid
            </Link>
            <Link href="/contact#klachten" className="text-white/40 hover:text-white text-sm transition-colors">
              Klachtenprocedure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
