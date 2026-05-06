import PageHero from "@/components/PageHero";
import SectionBlock from "@/components/SectionBlock";

export const metadata = {
  title: "Veelgestelde vragen - PJ Professionals",
  description:
    "Antwoorden op veelgestelde vragen over PJ Professionals, WMO, verwijzingen en privacy.",
};

const faqSections = [
  {
    id: "algemeen",
    title: "Algemeen",
    faqs: [
      {
        q: "Hoe kan ik contact opnemen met PJ Professionals?",
        a: "U kunt op verschillende manieren contact opnemen: Algemene vragen via bureaudienst@pjprofessionals.nl, telefonisch via 073-7621035, aanmeldingen via aanmeldingen@pjprofessionals.nl, sollicitaties via info@pjprofessionals.nl.",
      },
      {
        q: "Wat doet PJ Professionals precies?",
        a: "PJ Professionals biedt begeleiding, diagnostiek en behandeling binnen zowel de WMO als de forensische zorg. Wij ondersteunen cliënten op leefgebieden zoals wonen, financiën, structuur, gezondheid, relaties en veiligheid.",
      },
      {
        q: "Wanneer kan ik bij PJ Professionals terecht?",
        a: "U kunt bij ons terecht voor zowel lichte als complexe hulpvragen, zoals problemen met dagstructuur, financiën, psychische klachten, verslaving, LVB, administratie of combinatieproblemen.",
      },
      {
        q: "Is er een wachtlijst?",
        a: "De wachttijd verschilt per gemeente en type zorg. Wij streven naar snelle inzet en denken mee over tijdelijke oplossingen indien nodig.",
      },
      {
        q: "Hoe werkt outreachende begeleiding?",
        a: "Onze professionals komen bij de cliënt thuis of in de wijk. Dit verlaagt drempels en vergroot de effectiviteit van de begeleiding.",
      },
      {
        q: "Welke regio's bedienen jullie?",
        a: "'s-Hertogenbosch, MijnGemeenteDichtbij, Meierijstad, Sint-Michielsgestel, Vught, Maashorst, Bernheze en Oss.",
      },
      {
        q: "Hoe wordt de kwaliteit van zorg bewaakt?",
        a: "Wij werken met interne en externe audits, een Functionaris Gegevensbescherming, cliënttevredenheidsonderzoeken en ISO 9001 kwaliteitsnormen.",
      },
      {
        q: "Kunnen familieleden worden betrokken?",
        a: "Ja, wanneer dit past binnen de privacywetgeving en wenselijk is voor de cliënt.",
      },
      {
        q: "Wat als ik niet tevreden ben over de zorg?",
        a: "Wij gaan graag in gesprek. Voor klachten kunt u contact opnemen via secretariaat@pjprofessionals.nl.",
      },
    ],
  },
  {
    id: "clienten",
    title: "Voor cliënten",
    faqs: [
      {
        q: "Hoe kan ik ondersteuning krijgen via de WMO?",
        a: "Dit verloopt via de gemeente. Na een melding of gesprek bij het wijkteam kan een indicatie worden afgegeven.",
      },
      {
        q: "Wat kost WMO voor mij?",
        a: "De eigen bijdrage wordt bepaald door het CAK en is afhankelijk van uw persoonlijke situatie.",
      },
      {
        q: "Wat gebeurt er bij terugval?",
        a: "Wij blijven in contact en passen de begeleiding aan waar nodig. Terugval zien wij als onderdeel van herstel.",
      },
      {
        q: "Kunnen mensen met een LVB of verslaving bij jullie terecht?",
        a: "Ja. Wij hebben ruime ervaring met LVB, verslavingsproblematiek en combinaties daarvan.",
      },
      {
        q: "Wat gebeurt er als mijn situatie verandert?",
        a: "Wij passen de begeleiding aan bij veranderingen in bijvoorbeeld woonsituatie, financiën of gezondheid.",
      },
    ],
  },
  {
    id: "verwijzers",
    title: "Voor verwijzers",
    faqs: [
      {
        q: "Hoe meld ik een cliënt aan?",
        a: "Aanmeldingen kunnen via het aanmeldformulier, telefonisch overleg of e-mail naar aanmeldingen@pjprofessionals.nl. Wij koppelen snel terug over vervolgstappen.",
      },
      {
        q: "Kunnen cliënten met een justitiële maatregel bij jullie terecht?",
        a: "Ja, wij bieden begeleiding, diagnostiek en behandeling binnen de forensische zorg. Na afloop van een maatregel kan zorg worden voortgezet binnen de WMO.",
      },
      {
        q: "Hoe waarborgen jullie veiligheid?",
        a: "Wij werken met risicotaxaties, duidelijke samenwerkingsafspraken en vroegsignalering.",
      },
      {
        q: "Hoe waarborgen jullie kwaliteit?",
        a: "Door audits, richtlijnen, scholing en samenwerking met ketenpartners.",
      },
    ],
  },
  {
    id: "werkwijze",
    title: "Over onze werkwijze",
    faqs: [
      {
        q: "Werken jullie outreachend?",
        a: "Ja, de begeleiding vindt plaats in de leefomgeving van de cliënt.",
      },
      {
        q: "Wat gebeurt er tijdens een begeleidingstraject?",
        a: "Wij ondersteunen bij structuur, financiën, wonen, veiligheid, relaties, psychische uitdagingen en herstel na terugval.",
      },
      {
        q: "Hoe vaak vindt begeleiding plaats?",
        a: "Dat hangt af van de zorgvraag en risico's. Bij intensieve trajecten kan begeleiding meerdere keren per week plaatsvinden.",
      },
      {
        q: "Wat gebeurt er als meerdere leefgebieden vastlopen?",
        a: "Wij creëren overzicht en stabiliteit en schalen op wanneer nodig. We werken nauw samen met ketenpartners.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Over privacy en gegevens",
    faqs: [
      {
        q: "Hoe gaan jullie om met persoonsgegevens?",
        a: "Wij werken volgens de AVG en verwerken alleen noodzakelijke gegevens.",
      },
      {
        q: "Hebben jullie een Functionaris Gegevensbescherming?",
        a: "Ja, deze houdt toezicht op privacy en dataveiligheid.",
      },
      {
        q: "Worden gegevens gedeeld met andere partijen?",
        a: "Alleen wanneer dit noodzakelijk is voor de begeleiding of verplicht is binnen het justitieel kader.",
      },
      {
        q: "Hoe wordt datalekken voorkomen?",
        a: "Met interne protocollen, beveiligde systemen en periodieke controles.",
      },
    ],
  },
];

export default function VeelgesteldeVragen() {
  return (
    <>
      <PageHero
        badge="FAQ"
        title="Veelgestelde vragen"
        subtitle="Antwoorden op veelgestelde vragen over onze organisatie, werkwijze, aanmelding en privacy."
        image="/images/pjprofessionals13-alt.jpg"
      />

      {faqSections.map((section, i) => (
        <SectionBlock
          key={section.id}
          id={section.id}
          title={section.title}
          gray={i % 2 === 1}
        >
          <div className="space-y-4 not-prose">
            {section.faqs.map((faq) => (
              <details
                key={faq.q}
                className="group border border-gray-100 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 bg-white hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-teal-dark text-sm pr-4">
                    {faq.q}
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400 shrink-0 group-open:rotate-180 transition-transform"
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
                </summary>
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </SectionBlock>
      ))}
    </>
  );
}
