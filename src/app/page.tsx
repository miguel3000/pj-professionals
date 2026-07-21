import Link from "next/link";
import ParallaxDivider from "@/components/ParallaxDivider";

export default function Home() {
  return (
    <>
      {/* Hero with background image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/homepage-hero.jpg)",
            backgroundPosition: "50% top",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-dark/60 via-teal-dark/40 to-teal-dark/80" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20 sm:pb-24">
          <div className="text-center lg:text-left lg:max-w-md xl:max-w-lg">
            {/* Logo — inline so it scrolls away with the hero.
                PNG is used as a CSS mask so only the logo shape receives
                the tint colour; transparent negative space stays transparent. */}
            <div
              role="img"
              aria-label="PJ Professionals"
              className="mx-auto lg:mx-0 mb-10 w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 lg:w-60 lg:h-60 drop-shadow-2xl bg-white [mask-image:url(/logo.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-image:url(/logo.png)] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
            />

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
              Aandacht voor de mens{" "}
              <span className="bg-gradient-to-r from-teal-light to-teal-medium bg-clip-text text-transparent">
                achter het verhaal
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-white/80 font-light mb-8 drop-shadow-md">
              Een veilige basis om verder te komen
            </p>

            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto lg:max-w-none lg:mx-0 mb-10 leading-relaxed drop-shadow-md">
              PJ Professionals ondersteunt volwassenen met uiteenlopende
              hulpvragen, van dagelijkse praktische ondersteuning tot begeleiding
              en behandeling bij complexe situaties. Wij werken in de regio
              Noordoost-Brabant en zijn gespecialiseerd in complexe en meervoudige
              problematiek. Wij bouwen aan veiligheid, vertrouwen en duurzaam
              herstel — juist waar het vaak vastloopt.
            </p>

            <div className="flex items-start justify-center lg:justify-start gap-6 sm:gap-10">
              <Link href="/wmo-zorg" className="group flex flex-col items-center gap-3">
                <span className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-sm shadow-lg transition-all group-hover:scale-105 group-hover:border-white/70 group-hover:bg-white/15">
                  <span
                    aria-hidden="true"
                    className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 bg-white [mask-image:url(/icons/wmo.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-image:url(/icons/wmo.png)] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
                  />
                </span>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-white/90">
                  WMO
                </span>
              </Link>
              <Link href="/forensische-zorg" className="group flex flex-col items-center gap-3">
                <span className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-sm shadow-lg transition-all group-hover:scale-105 group-hover:border-white/70 group-hover:bg-white/15">
                  <span
                    aria-hidden="true"
                    className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 bg-white [mask-image:url(/icons/forensische-zorg.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-image:url(/icons/forensische-zorg.png)] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
                  />
                </span>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-white/90 text-center">
                  Forensische zorg
                </span>
              </Link>
              <Link href="/wlz-zorg" className="group flex flex-col items-center gap-3">
                <span className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-sm shadow-lg transition-all group-hover:scale-105 group-hover:border-white/70 group-hover:bg-white/15">
                  <span
                    aria-hidden="true"
                    className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 bg-white [mask-image:url(/icons/wlz.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-image:url(/icons/wlz.png)] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
                  />
                </span>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-white/90">
                  WLZ
                </span>
              </Link>
            </div>
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
      <section className="py-20 bg-teal-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Link
              href="/wmo-zorg"
              className="group relative overflow-hidden rounded-2xl h-[400px] hover:scale-[1.02] transition-transform duration-300"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url(/images/wmo.jpg)",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/90 via-teal-dark/40 to-teal-dark/20 group-hover:from-teal-dark/80 transition-colors duration-300" />
              <div className="relative h-full flex flex-col justify-end p-10 sm:p-12">
                <h2 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">
                  WMO
                </h2>
                <p className="text-white/80 leading-relaxed mb-4 drop-shadow-md">
                  WMO helpt volwassenen zelfstandig te leven en deel te
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
                  backgroundImage: "url(/images/pjprofessionals15-alt.jpg)",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/90 via-teal-dark/40 to-teal-dark/20 group-hover:from-teal-dark/80 transition-colors duration-300" />
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
        image="/images/hoe-wij-werken.jpg"
        height="h-auto"
        overlay="from-teal-dark/70 via-teal-dark/30 to-teal-dark/70"
      >
        <div className="py-20 max-w-2xl mx-auto px-4">
          <span className="text-teal-light font-semibold text-sm uppercase tracking-wider">
            Onze werkwijze
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-6 drop-shadow-lg">
            Hoe wij werken
          </h2>
          <p className="text-white/80 leading-relaxed mb-4">
            Wij geloven dat verandering begint met vertrouwen. Daarom sluiten
            we aan bij de situatie zoals die is en nemen we de tijd om iemand
            echt te leren kennen.
          </p>
          <p className="text-white/80 leading-relaxed">
            We werken met vaste gezichten, korte lijnen en een aanpak die
            praktisch en haalbaar is. Waar nodig nemen we de casusregie en
            zorgen we voor overzicht, afstemming en regie in het traject. Ook
            wanneer het moeilijk wordt, blijven we betrokken en werken we stap
            voor stap aan stabiliteit en herstel.
          </p>
        </div>
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
                className="bg-teal-surface rounded-2xl p-8 border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-teal-dark mb-3">
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
        image="/images/pjprofessionals10-alt.jpg"
        height="h-[40vh]"
        overlay="from-teal-dark/60 via-transparent to-teal-dark/60"
      />

      {/* Quick links */}
      <section className="py-20 bg-teal-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Voor verwijzers",
                desc: "Informatie over aanmelding, werkgebied en samenwerking.",
                href: "/voor-verwijzers",
                img: "/images/voorverwijzers.jpg",
              },
              {
                title: "Over PJ Professionals",
                desc: "Onze missie, visie, werkwijze en organisatiestructuur.",
                href: "/over-ons",
                img: "/images/over-ons.jpg",
              },
              {
                title: "Vacatures & stages",
                desc: "Werken bij PJ Professionals. Bekijk onze openstaande vacatures.",
                href: "/vacatures",
                img: "/images/vacatures.jpg",
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
                <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/90 via-teal-dark/30 to-teal-dark/10" />
                <div className="relative h-full flex flex-col justify-end p-8">
                  <h3 className="text-lg font-semibold text-white mb-1 drop-shadow-lg">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-3">
                    {item.desc}
                  </p>
                  <span className="text-teal-light text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
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
        image="/images/pjprofessionals14-alt.jpg"
        height="h-auto"
        overlay="from-teal-dark/80 via-teal-dark/60 to-teal-dark/80"
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
              className="px-8 py-4 bg-white text-teal-dark font-semibold rounded-xl hover:bg-white/90 transition-all text-base"
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
