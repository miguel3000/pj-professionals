import PageHero from "@/components/PageHero";
import SectionBlock from "@/components/SectionBlock";
import Link from "next/link";

export const metadata = {
  title: "Vacatures en stages - PJ Professionals",
  description:
    "Werken bij PJ Professionals. Bekijk onze vacatures en stageplaatsen.",
};

export default function Vacatures() {
  return (
    <>
      <PageHero
        badge="Vacatures & stages"
        title="Werken bij PJ Professionals"
        subtitle="Werken in een omgeving waar menselijkheid, professionaliteit en betrokkenheid samenkomen."
        image="/images/pjprofessionals12.jpg"
      />

      <SectionBlock id="werken-bij" title="Werken bij PJ Professionals">
        <p>
          Werken bij PJ Professionals betekent werken in een omgeving waar
          menselijkheid, professionaliteit en betrokkenheid samenkomen. Wij
          bieden zorg aan cliënten met uiteenlopende hulpvragen, zowel
          eenvoudige als complexe problematiek. Medewerkers krijgen ruimte om
          echt verschil te maken in het leven van cliënten en tegelijkertijd te
          groeien in hun vak.
        </p>
        <p>
          Onze organisatie investeert in ontwikkeling, scholing en werkplezier.
          Wij bieden een veilige en open werkomgeving waarin collega&apos;s
          samenwerken, van elkaar leren en elkaar ondersteunen.
        </p>
        <p>
          Onze begeleiders en behandelaren werken outreachend en zijn actief
          aanwezig in de leefomgeving van cliënten. Dit vraagt om
          zelfstandigheid, reflectie, goede communicatieve vaardigheden en het
          vermogen om te schakelen wanneer situaties veranderen.
        </p>
      </SectionBlock>

      <SectionBlock gray>
        <h2 className="text-2xl font-bold text-navy mb-6 not-prose">
          Waarom werken bij PJ Professionals?
        </h2>
        <div className="not-prose grid sm:grid-cols-2 gap-4">
          {[
            {
              title: "Klein & betrokken team",
              desc: "Iedereen kent elkaar en staat voor elkaar klaar.",
            },
            {
              title: "Korte lijnen",
              desc: "Jouw ideeën maken direct verschil.",
            },
            {
              title: "Flexibele werktijden",
              desc: "Gezonde balans tussen werk en privé.",
            },
            {
              title: "Allround & afwisselend werk",
              desc: "Geen dag is hetzelfde.",
            },
            {
              title: "Ruimte voor groei",
              desc: "Professionele ontwikkeling en scholing.",
            },
            {
              title: "GGZ CAO",
              desc: "Arbeidsvoorwaarden volgens de GGZ CAO, tijdelijk met uitzicht op vast contract.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl p-6 border border-gray-100"
            >
              <h3 className="font-semibold text-navy mb-1">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="ontwikkeling" title="Professionele ontwikkeling">
        <p>
          Wij investeren doorlopend in kennis en vaardigheden van medewerkers.
          Dit doen wij door:
        </p>
        <ul>
          <li>Interne trainingen</li>
          <li>Intervisie en casusbesprekingen</li>
          <li>Externe scholing</li>
          <li>Beroepsgerichte cursussen</li>
        </ul>
      </SectionBlock>

      <SectionBlock id="stages" title="Stageplaatsen" gray>
        <p>
          PJ Professionals is een erkend leerbedrijf. Wij werken samen met
          hogescholen en bieden stageplaatsen voor zowel MBO als HBO binnen de
          WMO en de forensische zorg. Stagiairs worden begeleid door ervaren
          medewerkers en krijgen de kans om praktijkervaring op te doen in een
          organisatie waar nabijheid en kwaliteit centraal staan.
        </p>
      </SectionBlock>

      <SectionBlock id="vacatures" title="Vacatureoverzicht">
        <p>
          Wij nodigen nieuwe collega&apos;s van harte uit om te ontdekken wat het
          betekent om bij PJ Professionals te werken. Solliciteren kan via ons
          contactformulier of door een bericht te sturen naar{" "}
          <a
            href="mailto:info@pjprofessionals.nl"
            className="text-accent hover:underline"
          >
            info@pjprofessionals.nl
          </a>
          .
        </p>
        <div className="not-prose space-y-4 mt-6">
          {[
            "Ambulant begeleider",
            "Regiebehandelaar GZ-psycholoog / Verpleegkundig specialist GGZ / Psychotherapeut",
          ].map((title) => (
            <div
              key={title}
              className="bg-surface rounded-xl p-6 border border-gray-100 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-navy">{title}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  PJ Professionals — Regio Den Bosch / Oss
                </p>
              </div>
              <Link
                href="/contact"
                className="px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-indigo transition-colors shrink-0"
              >
                Solliciteer
              </Link>
            </div>
          ))}
        </div>
      </SectionBlock>
    </>
  );
}
