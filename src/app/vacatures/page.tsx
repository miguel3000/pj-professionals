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
        image="/images/vacatures.jpg"
      />

      <SectionBlock id="werken-bij" title="Werken bij PJ Professionals">
        <p>
          Werken bij PJ Professionals betekent werken binnen een organisatie
          waarin professionaliteit, betrokkenheid en samenwerking centraal
          staan. We ondersteunen volwassenen met uiteenlopende hulpvragen,
          variërend van reguliere ondersteuningsvragen tot complexe
          casuïstiek. Medewerkers krijgen de ruimte om vanuit hun
          deskundigheid bij te dragen aan stabiliteit, herstel en
          ontwikkeling van cliënten.
        </p>
        <p>
          We investeren in vakinhoudelijke ontwikkeling, interne en externe
          scholing en duurzame inzetbaarheid. Daarbij streven we naar een
          open en veilige werkomgeving waarin collega&apos;s samenwerken,
          kennis delen, reflecteren op hun handelen en elkaar ondersteunen.
        </p>
        <p>
          Onze medewerkers werken veelal outreachend en zijn actief in de
          leefomgeving van cliënten. Behandeling en diagnostiek vinden
          voornamelijk plaats op onze kantoorlocaties. Het werk vraagt om
          zelfstandigheid, reflectief vermogen, goede communicatieve
          vaardigheden en het vermogen om zorgvuldig te handelen wanneer
          omstandigheden veranderen.
        </p>
      </SectionBlock>

      <SectionBlock gray>
        <h2 className="text-2xl font-bold text-teal-dark mb-6 not-prose">
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
              <h3 className="font-semibold text-teal-dark mb-1">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="ontwikkeling" title="Professionele ontwikkeling">
        <p>
          We investeren doorlopend in de kennis, vaardigheden en
          vakinhoudelijke ontwikkeling van onze medewerkers. De scholing
          wordt waar mogelijk afgestemd op de functie, ervaring en
          ontwikkelbehoeften van de medewerker.
        </p>
        <p>Dit doen we door middel van:</p>
        <ul>
          <li>interne trainingen;</li>
          <li>intervisie en casusbesprekingen;</li>
          <li>externe scholing;</li>
          <li>beroepsgerichte cursussen;</li>
        </ul>
      </SectionBlock>

      <SectionBlock id="stages" title="Stageplaatsen" gray>
        <p>
          PJ Professionals is een erkend leerbedrijf en werkt samen met
          mbo- en hbo-onderwijsinstellingen. We bieden stageplaatsen binnen
          de Wmo en de forensische zorg.
        </p>
        <p>
          Stagiairs worden begeleid door ervaren professionals en krijgen,
          passend bij hun opleidingsniveau en leerdoelen, de ruimte om
          praktijkervaring op te doen. Daarbij besteden we aandacht aan
          professionele ontwikkeling, reflectie, samenwerking en zorgvuldig
          handelen binnen de zorg.
        </p>
      </SectionBlock>

      <SectionBlock id="vacatures" title="Vacatureoverzicht">
        <p>
          Wij nodigen nieuwe collega&apos;s van harte uit om te ontdekken wat het
          betekent om bij PJ Professionals te werken. Solliciteren kan via ons
          contactformulier of door een bericht te sturen naar{" "}
          <a
            href="mailto:info@pjprofessionals.nl"
            className="text-teal-medium hover:underline"
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
              className="bg-teal-surface rounded-xl p-6 border border-gray-100 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-teal-dark">{title}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  PJ Professionals — Regio &apos;s-Hertogenbosch / Oss
                </p>
              </div>
              <Link
                href="/contact"
                className="px-4 py-2 bg-teal-dark text-white text-sm font-medium rounded-lg hover:bg-teal-dark transition-colors shrink-0"
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
