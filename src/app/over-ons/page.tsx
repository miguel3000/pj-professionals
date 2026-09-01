import PageHero from "@/components/PageHero";
import SectionBlock from "@/components/SectionBlock";
import ParallaxDivider from "@/components/ParallaxDivider";

export const metadata = {
  title: "Over PJ Professionals",
  description:
    "Een zorgorganisatie gespecialiseerd in ambulante begeleiding van volwassenen binnen de Wmo en Wlz en in begeleiding, behandeling en diagnostiek binnen de forensische zorg.",
};

export default function OverOns() {
  return (
    <>
      <PageHero
        badge="Over ons"
        title="Over PJ Professionals"
        subtitle="Een zorgorganisatie gespecialiseerd in ambulante begeleiding van volwassenen binnen de Wmo en Wlz en in begeleiding, behandeling en diagnostiek binnen de forensische zorg."
        image="/images/over-ons.jpg"
      />

      <SectionBlock>
        <p>
          PJ Professionals is een zorgorganisatie voor volwassenen met
          uiteenlopende hulpvragen. Binnen de Wmo en Wlz bieden wij
          ambulante begeleiding. Binnen de forensische zorg bieden wij
          begeleiding, behandeling en diagnostiek.
        </p>
        <p>
          Wij werken outreachend en stemmen onze aanpak af op de situatie en
          mogelijkheden van de cliënt. Stabiliteit, kwaliteit en duurzame
          ontwikkeling staan daarbij centraal. Wanneer meerdere partijen
          betrokken zijn, zorgen wij voor duidelijke afstemming en
          continuïteit binnen het traject.
        </p>
      </SectionBlock>

      <SectionBlock id="missie-visie" title="Missie & Visie" gray>
        <p>
          Onze missie is om bij te dragen aan het persoonlijke, sociale en
          maatschappelijke welzijn van onze cliënten. We ondersteunen hen bij
          het vergroten van hun zelfredzaamheid, het herstellen van
          vertrouwen en het opbouwen of behouden van een stabiele basis.
          Daarbij werken we aan rust, veiligheid en een betekenisvol
          dagelijks leven.
        </p>
        <p>
          Wij richten ons op ontwikkeling die ook op langere termijn
          standhoudt. Een professionele vertrouwensrelatie vormt daarvoor een
          belangrijke basis. We sluiten aan bij de situatie, mogelijkheden en
          doelen van de cliënt en werken vanuit motiverende gespreksvoering,
          oplossingsgericht werken en professionele nabijheid.
        </p>
        <h3>Kernwaarden</h3>
        <p>Onze kernwaarden vormen het fundament van onze werkwijze:</p>
        <ul>
          <li>Professionaliteit;</li>
          <li>Integriteit;</li>
          <li>Transparantie;</li>
          <li>Open communicatie;</li>
          <li>Authenticiteit;</li>
          <li>Maatwerk;</li>
          <li>Kwaliteit.</li>
        </ul>
      </SectionBlock>

      <SectionBlock id="werkwijze" title="Onze werkwijze">
        <p>
          Onze werkwijze is mensgericht, praktisch en gericht op duurzame
          ontwikkeling. De begeleiding vindt veelal outreachend plaats, in de
          leefomgeving van de cliënt. Hierdoor kunnen we aansluiten bij het
          dagelijks leven, veranderingen tijdig signaleren en samen werken
          aan stabiliteit, herstel en ontwikkeling.
        </p>
        <p>Kenmerkend voor onze werkwijze zijn:</p>
        <ul>
          <li>Professionele nabijheid en betrouwbaarheid;</li>
          <li>Duidelijke en haalbare doelen;</li>
          <li>Vroegsignalering van veranderingen en risico&apos;s;</li>
          <li>Samenwerking met gemeenten en betrokken ketenpartners;</li>
          <li>
            Het op- en afschalen van begeleiding wanneer de situatie daarom
            vraagt;
          </li>
          <li>Ondersteuning op de leefgebieden die voor de cliënt relevant zijn.</li>
        </ul>
      </SectionBlock>

      {/* Parallax: coffee/calm */}
      <ParallaxDivider
        image="/images/pjprofessionals6-alt.jpg"
        height="h-[35vh]"
        overlay="from-teal-dark/50 via-transparent to-teal-dark/50"
      />

      <SectionBlock id="ketenpartners" title="Ketenpartners" gray>
        <p>
          We werken nauw samen met gemeenten en wijkteams, de reclassering,
          ggz- en verslavingszorg, maatschappelijke opvang,
          woningcorporaties, schuldhulpverlening, Zorg- en Veiligheidshuizen
          en andere regionale ketenpartners. Waar nodig stemmen we af met
          specialistische teams.
        </p>
        <p>
          Deze samenwerking draagt bij aan samenhang en continuïteit binnen
          het traject, een zorgvuldige afstemming over risico&apos;s en
          verantwoordelijkheden en tijdig handelen wanneer de situatie van
          een cliënt verandert.
        </p>
      </SectionBlock>

      <SectionBlock id="organisatie" title="Organisatiestructuur">
        <h3>Bestuur en directie</h3>
        <p>
          PJ Professionals is opgericht door Paul Spijker en Jeroen Buuts.
          Het bestuur en de directie bepalen de strategische koers en zijn
          eindverantwoordelijk voor de kwaliteit, veiligheid en continuïteit
          van de zorg en de algemene bedrijfsvoering. Zij bewaken de
          financiële en organisatorische ontwikkeling, de naleving van
          wet- en regelgeving en de samenwerking met gemeenten en
          ketenpartners.
        </p>

        <h3>Teamleiders</h3>
        <p>
          Frank Versluis is teamleider van de regio &apos;s-Hertogenbosch en
          Aniëlka Jacobs van de regio Oss. De teamleiders zijn verantwoordelijk
          voor de dagelijkse aansturing van de zorgteams, het bewaken van de
          kwaliteit, de coördinatie van casuïstiek en de inhoudelijke
          ondersteuning van de professionals.
        </p>

        <h3>Zorgteams</h3>
        <p>
          Onze zorgteams zijn multidisciplinair samengesteld en bestaan
          onder meer uit verpleegkundig specialisten GGZ, ambulant
          begeleiders, basispsychologen, GGZ-agogen, GZ-psychologen en
          forensisch gespecialiseerde behandelaren en begeleiders. Vanuit hun
          eigen deskundigheid werken zij samen aan passende en samenhangende
          ondersteuning. Afhankelijk van hun functie, expertise en
          professionele registratie zijn zij werkzaam als ambulant
          begeleider, behandelaar of diagnosticus.
        </p>
        <p>
          Binnen de Wmo en WLZ bieden onze professionals uitsluitend
          ambulante begeleiding. Binnen de forensische zorg bieden zij
          begeleiding, behandeling en diagnostiek. Zij werken volgens
          professionele richtlijnen en stemmen hun inzet af op de hulpvraag,
          doelen en situatie van de cliënt.
        </p>

        <h3>Ondersteunende diensten</h3>
        <p>
          De organisatie wordt ondersteund door administratieve medewerkers,
          een beleidsmedewerker, kwaliteitsmedewerker en preventiemedewerker.
          Deze diensten zorgen voor structuur, veiligheid, actuele
          documentatie en soepele interne processen.
        </p>
      </SectionBlock>

      <SectionBlock id="duurzaamheid" title="Duurzaamheid en maatschappelijke verantwoordelijkheid" gray>
        <p>
          PJ Professionals streeft naar een duurzame en toekomstbestendige
          manier van werken. We maken bewuste keuzes op het gebied van
          materiaalgebruik, mobiliteit, kantoorvoorzieningen en interne
          processen.
        </p>
        <h3>Maatschappelijke bijdrage</h3>
        <p>
          Als erkend leerbedrijf bieden we studenten ruimte om
          praktijkervaring op te doen en zich professioneel te ontwikkelen.
          Daarnaast investeren we in de ontwikkeling en duurzame
          inzetbaarheid van onze medewerkers.
        </p>
        <h3>Social Return</h3>
        <p>
          PJ Professionals geeft actief invulling aan Social Return door
          werk-, leer- en ontwikkelmogelijkheden te bieden aan mensen voor
          wie deelname aan de arbeidsmarkt niet vanzelfsprekend is. We maken
          hierover duidelijke afspraken met onze opdrachtgevers en zorgen
          voor een zorgvuldige uitvoering en verantwoording.
        </p>
      </SectionBlock>

      {/* Parallax: watering can / growth */}
      <ParallaxDivider
        image="/images/pjprofessionals8-alt.jpg"
        height="h-[35vh]"
        overlay="from-teal-dark/60 via-transparent to-teal-dark/60"
      />

      <SectionBlock id="kwaliteit" title="Kwaliteit, audits en certificering">
        <p>
          Om de kwaliteit van onze zorg en bedrijfsvoering te bewaken en
          verder te ontwikkelen, voeren we interne audits uit en laten we
          periodiek externe audits uitvoeren door onafhankelijke deskundigen.
          De bevindingen worden geëvalueerd en waar nodig vertaald naar
          concrete verbetermaatregelen.
        </p>
        <p>
          Daarnaast voeren we jaarlijks een cliënttevredenheidsonderzoek uit.
          De resultaten geven inzicht in de ervaringen en wensen van
          cliënten en bieden aanknopingspunten voor verdere verbetering van
          onze zorgverlening.
        </p>
        <p>
          PJ Professionals is gecertificeerd volgens ISO 9001. Dit betekent
          dat ons kwaliteitsmanagementsysteem onafhankelijk is getoetst aan
          de eisen van deze internationale norm. Het systeem ondersteunt ons
          bij het beheersen, evalueren en voortdurend verbeteren van onze
          werkprocessen.
        </p>
      </SectionBlock>

      <SectionBlock id="privacy" title="Privacy en gegevensbescherming" gray>
        <p>
          We gaan zorgvuldig en vertrouwelijk om met persoonsgegevens en
          gezondheidsgegevens. PJ Professionals beschikt over een
          functionaris gegevensbescherming (FG), die onafhankelijk adviseert
          over en toezicht houdt op de naleving van de Algemene verordening
          gegevensbescherming (AVG).
        </p>
        <p>
          We houden een register van verwerkingsactiviteiten bij, voeren
          periodieke interne controles uit en treffen passende
          organisatorische en technische maatregelen om persoonsgegevens te
          beschermen. Onze medewerkers worden regelmatig geschoold in
          privacy, informatiebeveiliging en het zorgvuldig omgaan met
          vertrouwelijke informatie.
        </p>
      </SectionBlock>

      <SectionBlock id="clientenraad" title="Cliëntenraad">
        <p>
          De cliëntenraad behartigt de gemeenschappelijke belangen van onze
          cliënten en brengt het cliëntperspectief in bij onderwerpen die hen
          raken. De raad denkt mee over onder meer het beleid, de kwaliteit
          van zorg en mogelijke verbeteringen.
        </p>
        <p>
          De cliëntenraad komt meerdere keren per jaar bijeen en overlegt
          regelmatig met het bestuur en de directie. De raad kan gevraagd en
          ongevraagd advies geven en heeft bij bepaalde onderwerpen
          instemmingsrecht op grond van de Wet medezeggenschap cliënten
          zorginstellingen 2018 (Wmcz 2018).
        </p>
      </SectionBlock>
    </>
  );
}
