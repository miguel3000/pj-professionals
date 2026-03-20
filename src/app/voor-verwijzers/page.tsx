import PageHero from "@/components/PageHero";
import SectionBlock from "@/components/SectionBlock";
import Link from "next/link";

export const metadata = {
  title: "Voor verwijzers - PJ Professionals",
  description:
    "Informatie voor verwijzers over aanmelding, werkgebied en samenwerking met PJ Professionals.",
};

export default function VoorVerwijzers() {
  return (
    <>
      <PageHero
        badge="Voor verwijzers"
        title="Samenwerken aan stabiliteit en perspectief"
        subtitle="PJ Professionals is een betrouwbare samenwerkingspartner voor verwijzers. Wij zijn outreachend, actief aanwezig en blijven betrokken wanneer situaties complex worden."
        image="/images/pjprofessionals5.jpg"
      />

      <SectionBlock>
        <p>
          PJ Professionals is een betrouwbare samenwerkingspartner voor
          verwijzers doordat wij outreachend werken en actief aanwezig zijn in de
          leefwereld van cliënten. Wij blijven betrokken, juist wanneer situaties
          complex worden of dreigen vast te lopen. Onze organisatie combineert
          reguliere en complexe casuïstiek, waardoor wij duurzaam kunnen werken
          en flexibel kunnen inspelen op uiteenlopende hulpvragen.
        </p>
        <p>
          Daarnaast beschikken wij over ruime ervaring binnen zowel
          WMO-begeleiding, WLZ-begeleiding als forensische trajecten. Wij
          communiceren helder, tijdig en voorspelbaar, en werken volgens
          kwaliteitsnormen en erkende systemen.
        </p>
        <p>
          Onze organisatie is actief binnen de regio Brabant Noordoost. Wij
          bieden begeleiding binnen de Wet Maatschappelijke Ondersteuning en
          begeleiding, behandeling en diagnostiek binnen de forensische zorg.
        </p>
      </SectionBlock>

      <SectionBlock id="aanmelding" title="Aanmelding en verwijzing" gray>
        <p>
          Wij vinden het belangrijk dat verwijzers precies weten wat zij kunnen
          verwachten. Daarom is ons aanmeldproces eenvoudig en duidelijk.
          Aanmeldingen kunnen worden gedaan via e-mail, telefonisch overleg of
          via het aanmeldformulier.
        </p>
        <p>
          Na ontvangst beoordelen wij de situatie zorgvuldig en nemen wij contact
          op met de aanmelder en de cliënt. Wij streven naar snelle
          terugkoppeling over de vervolgstappen.
        </p>
        <p>
          Tijdens de intake bespreken wij leefgebieden, risicofactoren, doelen,
          veiligheid en verwachtingen. Indien nodig stemmen wij direct af met de
          verwijzer of andere betrokken ketenpartners.
        </p>
        <p>
          Wij werken samen met onder andere gemeenten en wijkteams, reclassering,
          huisartsen, professionals binnen de geestelijke gezondheidszorg,
          maatschappelijke organisaties, woonbegeleiders en consulenten binnen de
          Wet langdurige zorg.
        </p>
        <p>
          Wij bieden verwijzers duidelijke terugkoppeling, periodieke
          rapportages, contact in risicovolle situaties, betrokkenheid bij
          belangrijke beslismomenten en transparantie over draagkracht en
          mogelijkheden.
        </p>
      </SectionBlock>

      <SectionBlock id="werkgebied" title="Werkgebied">
        <p>
          PJ Professionals werkt in verschillende gemeenten in Noord-Brabant. Wij
          hebben locaties in Oss en &apos;s-Hertogenbosch en zijn actief in
          omliggende gebieden.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 not-prose mt-6">
          {[
            "Den Bosch",
            "MijnGemeenteDichtbij",
            "Meierijstad",
            "Sint Michielsgestel",
            "Vught",
            "Maashorst",
            "Bernheze",
            "Oss",
          ].map((gemeente) => (
            <div
              key={gemeente}
              className="bg-surface rounded-lg px-4 py-3 text-sm font-medium text-navy text-center border border-gray-100"
            >
              {gemeente}
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="documenten" title="Documenten en informatie" gray>
        <p>
          Op deze pagina kunnen verwijzers informatie vinden over het
          aanmeldformulier, informatie over onze werkwijze, jaarverslagen en
          kwaliteitsdocumenten. Wij zorgen dat alle documenten actueel en
          overzichtelijk beschikbaar zijn.
        </p>
        <p>
          Wij werken nauw samen met reclassering, GGZ-instellingen,
          maatschappelijke organisaties, schuldhulpverlening en wooncorporaties.
          Bij complexe casuïstiek betrekken wij waar nodig FACT-teams of andere
          specialistische afdelingen. Wanneer cliënten doorstromen vanuit
          justitie naar vrijwillige zorg, bieden wij een vloeiende overgang, wat
          continuïteit en stabiliteit waarborgt.
        </p>
      </SectionBlock>

      <SectionBlock id="contact-verwijzers" title="Contact voor verwijzers">
        <p>Verwijzers kunnen op verschillende manieren contact met ons opnemen:</p>
        <div className="not-prose grid sm:grid-cols-2 gap-4 mt-6">
          <div className="bg-surface rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold text-navy mb-2">Aanmeldingen</h3>
            <p className="text-gray-600 text-sm mb-1">
              <a
                href="mailto:aanmeldingen@pjprofessionals.nl"
                className="text-accent hover:underline"
              >
                aanmeldingen@pjprofessionals.nl
              </a>
            </p>
            <Link href="/contact" className="text-accent text-sm hover:underline">
              Aanmeldformulier →
            </Link>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold text-navy mb-2">Bureaudienst</h3>
            <p className="text-gray-600 text-sm mb-1">
              <a href="tel:073-7621035" className="text-accent hover:underline">
                073 - 762 1035
              </a>
            </p>
            <p className="text-gray-600 text-sm">
              <a
                href="mailto:bureaudienst@pjprofessionals.nl"
                className="text-accent hover:underline"
              >
                bureaudienst@pjprofessionals.nl
              </a>
            </p>
          </div>
        </div>
        <p className="mt-6">
          Onze teamleiders zijn beschikbaar om casuïstiek te bespreken, vragen
          te beantwoorden en mee te denken over passende oplossingen. Wij zien
          verwijzers als partners in het creëren van veiligheid, stabiliteit en
          perspectief voor cliënten.
        </p>
      </SectionBlock>
    </>
  );
}
