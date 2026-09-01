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
        image="/images/voorverwijzers.jpg"
      />

      <SectionBlock>
        <p>
          PJ Professionals is een betrouwbare samenwerkingspartner voor
          verwijzers. We werken outreachend en zijn actief aanwezig in de
          leefomgeving van cliënten. Ook wanneer een situatie complex wordt
          of dreigt vast te lopen, bieden we continuïteit en blijven we
          gericht op haalbare vervolgstappen.
        </p>
        <p>
          We hebben ruime ervaring met zowel reguliere als complexe
          casuïstiek. Hierdoor kunnen we flexibel inspelen op uiteenlopende
          ondersteuningsbehoeften en trajecten zorgvuldig afstemmen op de
          cliënt en de betrokken ketenpartners.
        </p>
        <p>
          Onze expertise omvat begeleiding vanuit de Wet maatschappelijke
          ondersteuning (Wmo), individuele ambulante begeleiding vanuit de
          Wet langdurige zorg (Wlz) via een persoonsgebonden budget en
          begeleiding, behandeling en diagnostiek binnen de forensische zorg.
          We communiceren helder en tijdig en werken volgens de geldende
          professionele richtlijnen en kwaliteitsnormen.
        </p>
        <p>PJ Professionals is actief in de regio Noordoost-Brabant.</p>
      </SectionBlock>

      <SectionBlock id="aanmelding" title="Aanmelding en verwijzing" gray>
        <p>
          We vinden het belangrijk dat verwijzers precies weten wat zij van
          ons kunnen verwachten. Daarom is ons aanmeldproces eenvoudig en
          duidelijk ingericht. Aanmeldingen kunnen per e-mail, na telefonisch
          overleg of via het aanmeldformulier op onze website worden gedaan.
          Wmo-toewijzingen ontvangen we via het iWmo-berichtenverkeer.
          Aanmeldingen binnen de forensische zorg verlopen via het
          Informatiesysteem Forensische Zorg (IFZO).
        </p>
        <p>
          Na ontvangst van de aanmelding beoordelen we of de hulpvraag
          aansluit bij ons aanbod en onze beschikbare capaciteit. Vervolgens
          nemen we contact op met de aanmelder en de cliënt. We streven
          ernaar snel en duidelijk terug te koppelen over de mogelijkheden
          en vervolgstappen.
        </p>
        <p>
          Tijdens de intake brengen we de hulpvraag, relevante leefgebieden,
          doelen en verwachtingen in kaart. Waar dit van toepassing is,
          bespreken we ook risicofactoren, beschermende factoren en
          veiligheid. Indien nodig stemmen we af met de verwijzer en andere
          betrokken ketenpartners.
        </p>
        <p>We werken onder meer samen met:</p>
        <ul>
          <li>gemeenten en wijkteams;</li>
          <li>de reclassering;</li>
          <li>huisartsen;</li>
          <li>
            professionals en organisaties binnen de geestelijke
            gezondheidszorg;
          </li>
          <li>maatschappelijke organisaties;</li>
        </ul>
        <p>
          Binnen de gemaakte afspraken en geldende privacyregels bieden we
          verwijzers duidelijke terugkoppeling, periodieke rapportages en
          tijdige afstemming bij risicovolle situaties of belangrijke
          beslismomenten. Daarnaast zijn we transparant over onze
          beschikbare capaciteit, expertise en de reikwijdte van ons aanbod.
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
            "'s-Hertogenbosch",
            "Boxtel",
            "Meierijstad",
            "Sint Michielsgestel",
            "Vught",
            "Maashorst",
            "Bernheze",
            "Oss",
          ].map((gemeente) => (
            <div
              key={gemeente}
              className="bg-teal-surface rounded-lg px-4 py-3 text-sm font-medium text-teal-dark text-center border border-gray-100"
            >
              {gemeente}
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="documenten" title="Documenten en informatie" gray>
        <p>
          Op deze pagina vinden verwijzers onder meer ons aanmeldformulier,
          informatie over onze werkwijze, jaarverslagen en relevante
          kwaliteitsdocumenten. We controleren en actualiseren deze
          documenten periodiek en zorgen ervoor dat de informatie
          overzichtelijk beschikbaar is.
        </p>
        <p>
          We werken nauw samen met de reclassering, ggz-instellingen,
          maatschappelijke organisaties, schuldhulpverlening en
          woningcorporaties. Bij complexe casuïstiek stemmen we waar nodig
          af met andere specialistische ketenpartners.
        </p>
        <p>
          Bij de overgang van een forensisch kader naar vrijwillige
          ondersteuning binnen de reguliere zorg streven we, in overleg met
          de cliënt en betrokken ketenpartners, naar een zorgvuldige
          overdracht of voortzetting van de begeleiding. Dit draagt bij aan
          de continuïteit van zorg en het behoud van stabiliteit.
        </p>
      </SectionBlock>

      <SectionBlock id="contact-verwijzers" title="Contact voor verwijzers">
        <p>Verwijzers kunnen op verschillende manieren contact met ons opnemen:</p>
        <div className="not-prose grid sm:grid-cols-2 gap-4 mt-6">
          <div className="bg-teal-surface rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold text-teal-dark mb-2">Aanmeldingen</h3>
            <p className="text-gray-600 text-sm mb-1">
              <a
                href="mailto:aanmeldingen@pjprofessionals.nl"
                className="text-teal-medium hover:underline"
              >
                aanmeldingen@pjprofessionals.nl
              </a>
            </p>
            <Link href="/contact" className="text-teal-medium text-sm hover:underline">
              Aanmeldformulier →
            </Link>
          </div>
          <div className="bg-teal-surface rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold text-teal-dark mb-2">Bureaudienst</h3>
            <p className="text-gray-600 text-sm mb-1">
              <a href="tel:073-7621035" className="text-teal-medium hover:underline">
                073 - 762 1035
              </a>
            </p>
            <p className="text-gray-600 text-sm">
              <a
                href="mailto:bureaudienst@pjprofessionals.nl"
                className="text-teal-medium hover:underline"
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
