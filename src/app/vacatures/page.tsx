import PageHero from "@/components/PageHero";
import SectionBlock from "@/components/SectionBlock";
import {
  VACANCY_LOCATION,
  applyHref,
  telHref,
  vacatures,
  type VacancyBlock,
} from "@/lib/vacatures";

export const metadata = {
  title: "Vacatures en stages - PJ Professionals",
  description:
    "Werken bij PJ Professionals. Bekijk onze vacatures en stageplaatsen.",
};

function Block({ block }: { block: VacancyBlock }) {
  if (typeof block === "string") return <p>{block}</p>;
  return (
    <ul className="list-disc pl-5 space-y-1 marker:text-teal-medium">
      {block.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

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
          betekent om bij PJ Professionals te werken. Solliciteren doet u via ons{" "}
          <a
            href="/contact?reden=sollicitatie#contactformulier"
            className="text-teal-medium hover:underline"
          >
            contactformulier
          </a>
          . Klik bij een vacature op Solliciteer, dan staat die vacature al
          voor u ingevuld.
        </p>
        <div className="not-prose space-y-4 mt-6">
          {vacatures.map((vacancy) => (
            <div
              key={vacancy.slug}
              id={vacancy.slug}
              className="bg-teal-surface rounded-xl p-6 border border-gray-100 scroll-mt-28"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-teal-dark">{vacancy.title}</h3>
                  {vacancy.subtitle && (
                    <p className="text-teal-dark text-sm mt-1">{vacancy.subtitle}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">{VACANCY_LOCATION}</p>
                </div>
                <a
                  href={applyHref(vacancy.slug)}
                  className="self-start sm:self-auto px-4 py-2 bg-teal-dark text-white text-sm font-medium rounded-lg hover:bg-teal-medium transition-colors shrink-0"
                >
                  Solliciteer
                </a>
              </div>

              <details className="group mt-4 border-t border-teal-dark/10 pt-4">
                <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-teal-dark hover:text-teal-medium transition-colors [&::-webkit-details-marker]:hidden">
                  <svg
                    className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="group-open:hidden">Lees de volledige vacature</span>
                  <span className="hidden group-open:inline">Verberg de vacature</span>
                </summary>

                <div className="mt-4 space-y-3 text-gray-700 text-[0.95rem] leading-relaxed">
                  {vacancy.intro.map((text) => (
                    <p key={text}>{text}</p>
                  ))}

                  {vacancy.sections.map((section, i) => (
                    <div key={section.heading ?? i} className="space-y-3">
                      {section.heading && (
                        <h4 className="pt-3 font-semibold text-teal-dark">{section.heading}</h4>
                      )}
                      {section.blocks.map((block, j) => (
                        <Block key={j} block={block} />
                      ))}
                    </div>
                  ))}

                  {vacancy.contact && (
                    <div className="pt-3">
                      <p>{vacancy.contact.intro}</p>
                      <ul className="mt-1 space-y-0.5">
                        {vacancy.contact.people.map((person) => (
                          <li key={person.name}>
                            {person.name}:{" "}
                            <a href={telHref(person.phone)} className="text-teal-medium hover:underline">
                              {person.phone}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4">
                    <a
                      href={applyHref(vacancy.slug)}
                      className="inline-block px-4 py-2 bg-teal-dark text-white text-sm font-medium rounded-lg hover:bg-teal-medium transition-colors"
                    >
                      Solliciteer op deze vacature
                    </a>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
        <p className="mt-6">
          Staat uw functie er niet tussen? Stuur ons dan een{" "}
          <a href={applyHref("open")} className="text-teal-medium hover:underline">
            open sollicitatie
          </a>
          .
        </p>
      </SectionBlock>
    </>
  );
}
