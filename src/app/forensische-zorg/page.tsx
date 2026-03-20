import PageHero from "@/components/PageHero";
import SectionBlock from "@/components/SectionBlock";
import ParallaxDivider from "@/components/ParallaxDivider";
import Link from "next/link";

export const metadata = {
  title: "Forensische zorg - PJ Professionals",
  description:
    "Begeleiding, diagnostiek en behandeling binnen de forensische zorg.",
};

export default function ForensischeZorg() {
  return (
    <>
      <PageHero
        badge="Forensische zorg"
        title="Forensische zorg"
        subtitle="Begeleiding, diagnostiek en behandeling binnen de forensische zorg. Wij werken samen met ketenpartners aan veiligheid, herstel en duurzame terugkeer in de maatschappij."
        image="/images/pjprofessionals15.jpg"
      />

      <SectionBlock title="Over forensische zorg bij PJ Professionals">
        <p>
          PJ Professionals biedt begeleiding, diagnostiek en behandeling binnen
          de forensische zorg. Wij werken met cliënten die in aanraking zijn
          gekomen met justitie en ondersteuning nodig hebben bij het opbouwen
          van een stabiel en veilig bestaan.
        </p>
        <p>
          Onze forensische zorgverlening richt zich op het verminderen van
          recidive, het herstellen van maatschappelijke participatie en het
          bieden van een veilige omgeving voor zowel de cliënt als de
          samenleving. Wij werken nauw samen met reclassering, gemeenten en
          andere ketenpartners.
        </p>
        <p>
          Wanneer cliënten doorstromen vanuit justitie naar vrijwillige zorg,
          bieden wij een vloeiende overgang. Dit waarborgt continuïteit en
          stabiliteit in het zorgtraject.
        </p>
      </SectionBlock>

      {/* Parallax: medicine/care */}
      <ParallaxDivider
        image="/images/pjprofessionals3.jpg"
        height="h-[40vh]"
        overlay="from-navy/60 via-transparent to-navy/60"
      />

      <section className="py-16 bg-gradient-to-r from-navy to-indigo">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Meer weten over forensische zorg?
          </h2>
          <p className="text-white/60 mb-6">
            Neem contact op met onze bureaudienst voor meer informatie.
          </p>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white text-navy font-semibold rounded-xl hover:bg-white/90 transition-all text-sm inline-block"
          >
            Neem contact op
          </Link>
        </div>
      </section>
    </>
  );
}
