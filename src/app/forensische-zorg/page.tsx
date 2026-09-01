import PageHero from "@/components/PageHero";
import SectionBlock from "@/components/SectionBlock";
import ParallaxDivider from "@/components/ParallaxDivider";
import Link from "next/link";

export const metadata = {
  title: "Forensische zorg - PJ Professionals",
  description:
    "PJ Professionals biedt forensische zorg in Den Bosch en Oss: ambulante begeleiding, behandeling en diagnostiek voor cliënten binnen een justitieel kader. Samenwerking met reclassering en ketenpartners.",
};

export default function ForensischeZorg() {
  return (
    <>
      <PageHero
        badge="Forensische zorg"
        title="Forensische zorg"
        subtitle="Binnen de forensische zorg bieden wij begeleiding, diagnostiek en behandeling. Samen met onze ketenpartners werken wij aan veiligheid, herstel en een duurzame terugkeer in de samenleving."
        image="/images/pjprofessionals15-alt.jpg"
      />

      <SectionBlock id="wat-is-forensische-zorg" title="Wat is forensische zorg?">
        <p>
          Forensische zorg is gespecialiseerde zorg voor cliënten die te maken
          hebben met een justitieel kader en bij wie sprake is van een
          verhoogd risico op herhaling van strafbaar gedrag, ontregeling of
          onveilige situaties. Binnen PJ Professionals combineren wij
          begeleiding, behandeling en diagnostiek in één geïntegreerde
          aanpak. Dit stelt ons in staat om niet alleen te werken aan
          risicoreductie, maar ook aan herstel, zelfredzaamheid en
          stabiliteit in het dagelijks leven.
        </p>
        <p>
          Onze forensische zorg richt zich op volwassenen vanaf 18 jaar die
          binnen een justitieel kader begeleiding, diagnostiek of behandeling
          nodig hebben. Vaak is sprake van complexe problematiek, zoals
          psychische of psychiatrische klachten, verslavingsproblematiek of
          een licht verstandelijke beperking. Veel cliënten hebben meerdere
          zorgtrajecten doorlopen of hebben ervaren dat de reguliere zorg
          onvoldoende bij hun behoeften aansloot.
        </p>
        <p>
          Onze werkwijze kenmerkt zich door vasthoudendheid, professionele
          betrokkenheid en een praktische aanpak. Ook wanneer de begeleiding
          complex is, bieden wij continuïteit en stemmen we onze aanpak af op
          de situatie, mogelijkheden en doelen van de cliënt.
        </p>
      </SectionBlock>

      <SectionBlock id="visie-en-werkwijze" title="Visie en werkwijze" gray>
        <p>
          Wij geloven dat duurzame gedragsverandering wordt versterkt wanneer
          begeleiding en behandeling nauw aansluiten bij de leefomgeving en
          dagelijkse praktijk van de cliënt. Forensische zorg gaat daarbij
          verder dan het naleven van opgelegde voorwaarden. Wij onderzoeken
          welke factoren samenhangen met risicovol of delictgedrag en werken
          gericht aan het versterken van beschermende factoren. Veiligheid en
          herstel gaan hierin samen: door stabiliteit te bevorderen,
          risico&apos;s te beperken en vertrouwen op te bouwen, ontstaat
          ruimte voor gedragsverandering en maatschappelijke participatie.
        </p>
        <p>
          Wij werken vanuit de uitgangspunten van het
          Risk-Need-Responsivitymodel (RNR-model). Dit betekent dat wij de
          intensiteit van de zorg afstemmen op het risico, ons richten op
          veranderbare factoren die samenhangen met delictgedrag en onze
          aanpak laten aansluiten bij de mogelijkheden, motivatie en leerstijl
          van de cliënt. Het RNR-model vormt een belangrijk kader voor
          effectieve forensische interventies.
        </p>
        <p>
          Binnen dit kader maken wij onder meer gebruik van motiverende
          gespreksvoering, oplossingsgerichte interventies en
          cognitief-gedragstherapeutische technieken. De werkrelatie tussen
          cliënt en professional staat daarbij centraal. Een goede
          werkrelatie kan weerstand verminderen, motivatie versterken en
          eraan bijdragen dat risicovolle situaties tijdig worden herkend en
          bespreekbaar worden gemaakt.
        </p>
        <h3>Onze werkwijze</h3>
        <p>
          Onze begeleiding vindt veelal outreachend plaats. Wij spreken
          cliënten thuis, op straat, op hun woonlocatie of in de wijk.
          Hierdoor kunnen wij nauw aansluiten bij de risico&apos;s,
          ondersteuningsbehoeften en mogelijkheden in het dagelijks leven.
          Door actief betrokken te zijn, kunnen wij veranderingen en
          dreigende ontregeling vroegtijdig signaleren, bijvoorbeeld bij
          toenemende stress, middelengebruik of spanningen binnen het
          sociale netwerk.
        </p>
        <p>
          Behandeling en diagnostiek vinden voornamelijk plaats op onze
          kantoorlocaties. Deze omgeving biedt rust, structuur en privacy en
          vormt daarmee een passende setting voor zorgvuldig diagnostisch
          onderzoek en behandeling.
        </p>
        <p>
          We starten met een intake waarin onder meer de hulpvraag, het
          delictverleden, het huidige functioneren, de psychosociale
          omstandigheden en eerder ingezette interventies systematisch in
          kaart worden gebracht. Vervolgens voeren we een risicotaxatie uit
          met behulp van de Forensische Ambulante Risico Evaluatie (FARE).
          Met dit instrument schatten we het algemene recidiverisico in en
          volgen we veranderingen in dynamische risicofactoren gedurende het
          traject. Daarbij brengen we statische, individuele dynamische en
          contextuele dynamische risicofactoren in kaart. Ook aanvullende
          risico- en beschermende factoren worden meegewogen.
        </p>
        <p>
          Op basis van de verzamelde informatie stellen we, wanneer dit
          passend is, een delictanalyse op. Hierin onderzoeken we de
          samenhang tussen gedachten, gevoelens, omstandigheden en gedrag
          rondom het delict. We formuleren hypothesen over de factoren en
          mechanismen die het delictgedrag hebben beïnvloed of in stand
          kunnen houden. De delictanalyse biedt richting aan de doelen en
          interventies binnen de verdere begeleiding en behandeling.
        </p>
        <p>Onze werkwijze omvat:</p>
        <ul>
          <li>Intensieve begeleiding bij complexe casuïstiek;</li>
          <li>Risicotaxatie en doorlopende risicomonitoring;</li>
          <li>Vroegsignalering van spanningsopbouw, ontregeling of terugval;</li>
          <li>Samenwerking met ketenpartners;</li>
          <li>
            Duidelijke afspraken over veiligheid, grenzen en
            verantwoordelijkheden;
          </li>
          <li>Het opstellen en evalueren van behandel- en begeleidingsplannen;</li>
          <li>Het inzetten van interventies die zijn gericht op gedragsverandering;</li>
          <li>
            Ondersteuning bij praktische levensgebieden, zoals wonen,
            financiën en gezondheid.
          </li>
        </ul>
      </SectionBlock>

      <SectionBlock id="risicotaxatie" title="Risicotaxatie en veiligheid">
        <p>
          Veiligheid vormt de basis van onze forensische zorg. We combineren
          periodieke risicotaxaties met voortdurende aandacht voor actuele
          risico- en beschermende factoren. Daarbij kijken we onder meer naar
          middelengebruik, agressief gedrag, impulsiviteit, stress en de
          invloed van het sociale netwerk.
        </p>
        <p>
          Door veranderingen structureel te volgen, kunnen we een toenemende
          spanningsopbouw of dreigende ontregeling vroegtijdig signaleren.
          Wanneer de veiligheid onder druk komt te staan, handelen we volgens
          de gemaakte veiligheidsafspraken en stemmen we waar nodig af met de
          cliënt en betrokken ketenpartners. Onze professionals zijn getraind
          in het herkennen van signalen van ontregeling en handelen duidelijk
          wanneer grenzen of veiligheid in het geding zijn.
        </p>
        <h3>Doel van onze forensische zorg</h3>
        <p>Onze forensische zorg heeft twee samenhangende doelen:</p>
        <ol>
          <li>Het verkleinen van het risico op herhaling van strafbaar gedrag.</li>
          <li>
            Het ondersteunen van de cliënt bij het opbouwen van een
            stabieler leven met meer structuur, zelfredzaamheid en
            perspectief.
          </li>
        </ol>
        <p>
          We streven naar veranderingen die ook in het dagelijks leven kunnen
          worden volgehouden. Door begeleiding op maat te bieden, betrokken
          te blijven en te investeren in een professionele
          vertrouwensrelatie, ondersteunen we cliënten bij het vergroten van
          de grip op hun gedrag en omstandigheden.
        </p>
        <h3>Een duurzaam vervolg</h3>
        <p>
          Na afloop van een strafrechtelijke maatregel of forensische
          zorgtitel kan verdere ondersteuning nodig zijn. Waar dit passend is
          en binnen de geldende indicatie mogelijk is, kan PJ Professionals
          deze ondersteuning voortzetten of bijdragen aan een zorgvuldige
          overdracht.
        </p>
        <p>
          Zo bevorderen we de continuïteit van zorg en verkleinen we het
          risico op ontregeling, terugval, dakloosheid of sociaal isolement.
          De overgang van forensische zorg naar reguliere ondersteuning
          verloopt daardoor zo zorgvuldig en geleidelijk mogelijk.
        </p>
        <p>
          Forensische zorg bij PJ Professionals betekent werken aan
          veiligheid, herstel en toekomstperspectief. We staan naast de
          cliënt en zijn tegelijkertijd duidelijk over kaders, grenzen en
          verantwoordelijkheden. Bij complexe trajecten bieden we
          continuïteit, bewaken we de gezamenlijke koers en stemmen we onze
          inzet zorgvuldig af met de cliënt en betrokken ketenpartners.
        </p>
      </SectionBlock>

      <SectionBlock id="begeleiding-behandeling" title="Begeleiding, behandeling en diagnostiek" gray>
        <p>
          Wij bieden ambulante begeleiding, behandeling en diagnostiek. De
          behandeling kan bestaan uit gesprekken die zijn gericht op het
          vergroten van inzicht in gedrag, het aanleren van nieuwe
          copingvaardigheden, het verminderen van risicofactoren en het
          versterken van beschermende factoren. Diagnostiek helpt om de
          problematiek, het functioneren en de behandel- of
          ondersteuningsbehoefte zorgvuldig in kaart te brengen.
        </p>
        <p>
          De begeleiding richt zich op het stabiliseren en structureren van
          het dagelijks leven. Daarmee worden belangrijke voorwaarden
          gecreëerd voor herstel en gedragsverandering. Begeleiding,
          behandeling en diagnostiek worden waar nodig in samenhang ingezet
          en op elkaar afgestemd.
        </p>
        <p>
          Onze professionals worden intern en extern geschoold en werken
          volgens de geldende professionele richtlijnen en kwaliteitsnormen
          binnen de forensische zorg. Dit betekent dat we werken vanuit
          duidelijke kaders, zorgvuldig rapporteren en evalueren en
          voortdurend aandacht hebben voor veiligheid, risicofactoren,
          beschermende factoren en vroegsignalering.
        </p>
      </SectionBlock>

      <SectionBlock id="ketenpartners" title="Samenwerking met ketenpartners">
        <p>
          Een zorgvuldige afstemming tussen alle betrokken partijen is
          essentieel binnen de forensische zorg. Daarom werkt PJ
          Professionals nauw samen met onder meer de reclassering,
          ggz-instellingen, maatschappelijke organisaties en gemeenten.
          Binnen de geldende privacyregels en professionele kaders draagt
          deze samenwerking bij aan:
        </p>
        <ul>
          <li>samenhang en continuïteit binnen het traject;</li>
          <li>goede afstemming van begeleiding en behandeling;</li>
          <li>
            duidelijke communicatie over risico&apos;s, doelen en
            verantwoordelijkheden;
          </li>
          <li>het beperken van misverstanden en hiaten in de ondersteuning;</li>
          <li>
            een integraal plan waarin zorg, veiligheid en de justitiële
            voorwaarden samenkomen.
          </li>
        </ul>
        <p>
          Wanneer een cliënt een justitiële maatregel of forensische
          zorgtitel afrondt, bekijken we samen met de cliënt en betrokken
          ketenpartners welke vervolgondersteuning nodig is. Als de gemeente
          hiervoor een Wmo-indicatie afgeeft, kan PJ Professionals de
          ambulante begeleiding binnen een vrijwillig kader voortzetten. Deze
          continuïteit kan bijdragen aan het behoud van stabiliteit en het
          verkleinen van het risico op terugval.
        </p>
      </SectionBlock>

      {/* Parallax divider */}
      <ParallaxDivider
        image="/images/pjprofessionals8-new.jpg"
        height="h-[35vh]"
        overlay="from-teal-dark/60 via-transparent to-teal-dark/60"
      />

      <SectionBlock id="kwaliteit" title="Kwaliteit en ontwikkeling" gray>
        <p>
          PJ Professionals werkt structureel aan het verbeteren en borgen van
          de kwaliteit van zorg. Daarbij sluiten we aan bij het
          Kwaliteitskader Forensische Zorg (2022–2028). We investeren gericht
          in veiligheid, vakmanschap, samenwerking en transparantie.
        </p>
        <h3>Kwaliteitsborging</h3>
        <p>
          Sinds 2018 wordt ons kwaliteitsmanagementsysteem volgens ISO 9001
          stapsgewijs doorontwikkeld. Werkprocessen rondom veiligheid,
          risicotaxatie, overdracht en samenwerking zijn vastgelegd en worden
          periodiek geëvalueerd en waar nodig aangescherpt. Door vaste
          overlegmomenten, professionele reflectie en interne/externe audits
          is kwaliteitsontwikkeling verankerd in het dagelijks handelen van
          het forensische team.
        </p>
        <h3>Cliënt- en medewerkerparticipatie</h3>
        <p>
          PJ Professionals voert structureel tevredenheidsonderzoeken uit
          onder cliënten, medewerkers en ketenpartners. De uitkomsten worden
          opgenomen in het kwaliteitsmanagementsysteem en gebruikt om het
          beleid en de werkwijze verder te verbeteren. Daarnaast beschikt PJ
          Professionals over een vaste cliëntenraad die meerdere keren per
          jaar bijeenkomt en vanuit het cliëntperspectief meedenkt over de
          kwaliteit van zorg.
        </p>
        <h3>Forensisch vakmanschap</h3>
        <p>
          Onze professionals werken volgens methodieken die aansluiten bij de
          doelgroep en hun vakgebied. Zij volgen interne en externe scholing,
          waaronder modules uit de Forensische Leerlijn. PJ Professionals is
          een erkend leerbedrijf en werkt samen met onderwijsinstellingen op
          mbo-, hbo- en universitair niveau. Studenten voeren binnen onze
          organisatie praktijkgericht onderzoek uit naar onderwerpen zoals
          veiligheidscultuur, netwerkbetrokkenheid en motiverende
          gespreksvoering.
        </p>
        <h3>Samenwerking en transparantie</h3>
        <p>
          PJ Professionals werkt intensief samen met de reclassering,
          GGZ-instellingen, maatschappelijke opvang, gemeenten en andere
          ketenpartners. Deelname aan lerende netwerken en regionale
          samenwerkingsverbanden draagt bij aan kennisdeling, onderlinge
          afstemming en continuïteit van zorg.
        </p>
      </SectionBlock>

      <SectionBlock id="veelgestelde-vragen" title="Veelgestelde vragen">
        <div className="space-y-4 not-prose">
          {[
            {
              q: "Wat is forensische zorg?",
              a: "Forensische zorg is zorg voor mensen die binnen een justitieel kader begeleiding, behandeling of diagnostiek nodig hebben. Het doel is om risico's te verminderen, veiligheid te vergroten en cliënten te helpen bij het opbouwen van een stabiel en zinvol leven.",
            },
            {
              q: "Voor wie is forensische zorg bedoeld?",
              a: "Forensische zorg is bedoeld voor volwassenen die te maken hebben met een strafrechtelijke maatregel of voor wie een verhoogd risico bestaat op herhaling van strafbaar gedrag. Vaak spelen er problemen op meerdere leefgebieden, zoals psychische klachten, verslaving, een licht verstandelijke beperking of instabiliteit in de sociale omgeving.",
            },
            {
              q: "Hoe ziet de begeleiding eruit?",
              a: "Onze begeleiding is outreachend en vindt plaats in de leefomgeving van de cliënt. De professional komt bij de cliënt thuis, op straat of op andere plekken waar ondersteuning nodig is. We werken met duidelijke kaders, evalueren regelmatig en hebben een actieve houding in het signaleren van risico's.",
            },
            {
              q: "Welke vormen van zorg biedt PJ Professionals?",
              a: "Wij bieden ambulante begeleiding, ambulante behandeling, diagnostiektrajecten, ondersteuning bij risicotaxatie, crisisinterventies binnen het ambulant kader en samenwerking met reclassering en ketenpartners. We stemmen altijd af welke vorm het beste past bij de situatie.",
            },
            {
              q: "Hoe verloopt een aanmelding?",
              a: "De aanmelding verloopt meestal via de reclassering, een Penitentiaire Inrichting, een behandelaar of een andere betrokken instantie. Na aanmelding nemen wij contact op met de cliënt én de verwijzer om een intake te plannen. Daarna wordt een begeleidings- of behandelplan opgesteld.",
            },
            {
              q: "Werken jullie samen met reclassering en andere ketenpartners?",
              a: "Ja. Wij hebben intensieve samenwerking met reclassering, GGZ-instellingen, maatschappelijke organisaties, FACT-teams, schuldhulpverlening, woonbegeleiding en andere betrokken partners. Goede samenwerking zorgt voor samenhang in het traject en meer veiligheid voor cliënt en omgeving.",
            },
            {
              q: "Wat gebeurt er als de justitiële maatregel afloopt?",
              a: "Wanneer de maatregel eindigt, stopt onze betrokkenheid niet automatisch. Indien gewenst kan de zorg worden voortgezet binnen de WMO of een ander vrijwillig kader. Dit voorkomt terugval, instabiliteit of het opnieuw wegvallen van ondersteuning.",
            },
            {
              q: "Wat als een cliënt niet meewerkt of afspraken niet nakomt?",
              a: "We blijven altijd in gesprek en onderzoeken wat er achter het gedrag schuilgaat. Als veiligheid in het geding komt, handelen wij volgens professionele richtlijnen en stemmen we af met reclassering of andere betrokken partijen. Heldere kaders en consequente communicatie zijn hierbij essentieel.",
            },
          ].map((faq) => (
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

      {/* CTA */}
      <ParallaxDivider
        image="/images/pjprofessionals8-alt.jpg"
        height="h-auto"
        overlay="from-teal-dark/80 via-teal-dark/60 to-teal-dark/80"
      >
        <div className="py-16">
          <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
            Meer weten over forensische zorg?
          </h2>
          <p className="text-white/70 mb-6">
            Neem contact op met onze bureaudienst of bekijk het aanmeldproces
            voor verwijzers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 bg-white text-teal-dark font-semibold rounded-xl hover:bg-white/90 transition-all text-sm"
            >
              Neem contact op
            </Link>
            <Link
              href="/voor-verwijzers"
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all text-sm backdrop-blur-sm"
            >
              Voor verwijzers
            </Link>
          </div>
        </div>
      </ParallaxDivider>
    </>
  );
}
