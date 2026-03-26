import Link from "next/link";
import Image from "next/image";
import ParallaxDivider from "@/components/ParallaxDivider";

export default function Home2() {
  return (
    <>
      {/* Hero with background image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/pjprofessionals1.jpg)",
            backgroundPosition: "center top",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/40 to-navy/80" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          {/* Large centered logo with backdrop */}
          <div className="mb-10 inline-block">
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

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
            Wij blijven staan waar{" "}
            <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
              anderen afhaken.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-md">
            PJ Professionals ondersteunt volwassenen met uiteenlopende
            hulpvragen, van reguliere begeleiding tot complexe casuistiek. Wij
            werken in de regio Den Bosch en Oss en combineren expertise in
            WMO-zorg en forensische zorg met een duurzame aanpak waarin
            veiligheid en herstel samenkomen.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/wmo-zorg"
              className="px-8 py-4 bg-white text-navy font-semibold rounded-xl hover:bg-white/90 transition-all hover:shadow-lg hover:shadow-white/10 text-base backdrop-blur-sm"
            >
              WMO-zorg
            </Link>
            <Link
              href="/forensische-zorg"
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all text-base backdrop-blur-sm"
            >
              Forensische zorg
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all text-base backdrop-blur-sm"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-600 leading-relaxed">
            Wij geloven dat ieder mens recht heeft op rust, stabiliteit en
            participatie in de samenleving. Daarom werken wij outreachend,
            persoonlijk en met maatwerk dat aansluit op het dagelijks leven. Onze
            begeleiding is flexibel in intensiteit, gericht op het vergroten van
            eigen regie en gebaseerd op vertrouwen.
          </p>
        </div>
      </section>

      {/* Two main services with background images */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Link
              href="/wmo-zorg"
              className="group relative overflow-hidden rounded-2xl h-[400px] hover:scale-[1.02] transition-transform duration-300"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url(/images/pjprofessionals9.jpg)",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-navy/20 group-hover:from-navy/80 transition-colors duration-300" />
              <div className="relative h-full flex flex-col justify-end p-10 sm:p-12">
                <h2 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">
                  WMO-zorg
                </h2>
                <p className="text-white/80 leading-relaxed mb-4 drop-shadow-md">
                  WMO-zorg helpt volwassenen zelfstandig te leven en deel te
                  nemen aan de maatschappij. Wij bieden ondersteuning bij wonen,
                  financien, gezondheid, sociale relaties, daginvulling en
                  veiligheid.
                </p>
                <span className="inline-flex items-center gap-2 text-white/90 font-medium text-sm group-hover:text-white transition-colors">
                  Meer informatie
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            </Link>

            <Link
              href="/forensische-zorg"
              className="group relative overflow-hidden rounded-2xl h-[400px] hover:scale-[1.02] transition-transform duration-300"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url(/images/pjprofessionals15.jpg)",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-navy/20 group-hover:from-navy/80 transition-colors duration-300" />
              <div className="relative h-full flex flex-col justify-end p-10 sm:p-12">
                <h2 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">
                  Forensische zorg
                </h2>
                <p className="text-white/80 leading-relaxed mb-4 drop-shadow-md">
                  Begeleiding, diagnostiek en behandeling binnen de forensische
                  zorg. Wij werken samen met ketenpartners aan veiligheid,
                  herstel en duurzame terugkeer in de maatschappij.
                </p>
                <span className="inline-flex items-center gap-2 text-white/90 font-medium text-sm group-hover:text-white transition-colors">
                  Meer informatie
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Parallax: counseling session */}
      <ParallaxDivider
        image="/images/pjprofessionals7.jpg"
        height="h-[50vh]"
        overlay="from-navy/70 via-navy/30 to-navy/70"
      >
        <span className="text-accent-light font-semibold text-sm uppercase tracking-wider">
          Onze werkwijze
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 drop-shadow-lg">
          Hoe wij werken
        </h2>
      </ParallaxDivider>

      {/* Kernwaarden */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Outreachend",
                desc: "Wij zijn actief in de leefomgeving van de client en bieden stabiliteit waar het nodig is.",
              },
              {
                title: "Persoonlijk",
                desc: "Maatwerk dat aansluit op het dagelijks leven, met aandacht voor de unieke situatie.",
              },
              {
                title: "Duurzaam",
                desc: "Wij investeren in langdurige vooruitgang en blijven betrokken bij terugval.",
              },
              {
                title: "Flexibel",
                desc: "Begeleiding wordt op- en afgeschaald wanneer de situatie verandert.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-surface rounded-2xl p-8 border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-navy mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax: holding hands */}
      <ParallaxDivider
        image="/images/pjprofessionals10.jpg"
        height="h-[40vh]"
        overlay="from-navy/60 via-transparent to-navy/60"
      />

      {/* Quick links */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Voor verwijzers",
                desc: "Informatie over aanmelding, werkgebied en samenwerking.",
                href: "/voor-verwijzers",
                img: "/images/pjprofessionals5.jpg",
              },
              {
                title: "Over PJ Professionals",
                desc: "Onze missie, visie, werkwijze en organisatiestructuur.",
                href: "/over-ons",
                img: "/images/pjprofessionals11.jpg",
              },
              {
                title: "Vacatures & stages",
                desc: "Werken bij PJ Professionals. Bekijk onze openstaande vacatures.",
                href: "/vacatures",
                img: "/images/pjprofessionals12.jpg",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative overflow-hidden rounded-2xl h-[280px] hover:scale-[1.02] transition-transform duration-300"
              >
                <div
                  className="absolute inset-0 group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage: `url(${item.img})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-navy/10" />
                <div className="relative h-full flex flex-col justify-end p-8">
                  <h3 className="text-lg font-semibold text-white mb-1 drop-shadow-lg">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-3">
                    {item.desc}
                  </p>
                  <span className="text-accent-light text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Lees meer
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with parallax background */}
      <ParallaxDivider
        image="/images/pjprofessionals14.jpg"
        height="h-auto"
        overlay="from-navy/80 via-navy/60 to-navy/80"
      >
        <div className="py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Neem contact met ons op
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            Heeft u vragen of wilt u een client aanmelden? Onze bureaudienst is
            bereikbaar tijdens kantooruren.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-navy font-semibold rounded-xl hover:bg-white/90 transition-all text-base"
            >
              Contactformulier
            </Link>
            <a
              href="tel:073-7621035"
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all text-base backdrop-blur-sm"
            >
              073 - 762 1035
            </a>
          </div>
        </div>
      </ParallaxDivider>
    </>
  );
}
