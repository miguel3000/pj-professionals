import PageHero from "@/components/PageHero";
import SectionBlock from "@/components/SectionBlock";
import ParallaxDivider from "@/components/ParallaxDivider";

export const metadata = {
  title: "Over PJ Professionals",
  description:
    "PJ Professionals is een zorgorganisatie gespecialiseerd in begeleiding en behandeling van volwassenen binnen de WMO en forensische zorg.",
};

export default function OverOns() {
  return (
    <>
      <PageHero
        badge="Over ons"
        title="Over PJ Professionals"
        subtitle="Een zorgorganisatie gespecialiseerd in begeleiding en behandeling van volwassenen met uiteenlopende hulpvragen binnen de WMO en de forensische zorg."
        image="/images/pjprofessionals11.jpg"
      />

      <SectionBlock>
        <p>
          PJ Professionals is een zorgorganisatie gespecialiseerd in begeleiding
          en behandeling van volwassenen met uiteenlopende hulpvragen binnen de
          WMO en de forensische zorg. Wij werken outreachend, persoonlijk en
          duurzaam. Onze organisatie staat voor stabiliteit, betrokkenheid en
          kwaliteit. Wij blijven staan waar anderen afhaken en bieden cliënten,
          verwijzers en gemeenten een betrouwbare samenwerkingspartner.
        </p>
      </SectionBlock>

      <SectionBlock id="missie-visie" title="Missie & Visie" gray>
        <p>
          Onze missie is om bij te dragen aan het persoonlijk, sociaal en
          maatschappelijk welzijn van onze cliënten. Wij geloven dat iedereen
          recht heeft op rust, veiligheid en een betekenisvol leven. Wij
          ondersteunen cliënten bij het vergroten van hun zelfredzaamheid, het
          herstellen van vertrouwen en het opbouwen van een stabiele basis.
        </p>
        <p>
          Wij richten ons op duurzame verandering. Dit betekent dat wij
          investeren in de relatie met onze cliënten, omdat herstel begint bij
          vertrouwen. Onze aanpak is gebaseerd op motiverende gespreksvoering,
          oplossingsgericht werken en nabijheid.
        </p>
        <p>Onze kernwaarden vormen het fundament van onze manier van werken:</p>
        <ul>
          <li>Professionaliteit</li>
          <li>Integriteit</li>
          <li>Transparantie</li>
          <li>Open communicatie</li>
          <li>Authenticiteit</li>
          <li>Maatwerk</li>
          <li>Kwaliteit</li>
        </ul>
      </SectionBlock>

      <SectionBlock id="werkwijze" title="Onze werkwijze">
        <p>
          Onze werkwijze is mensgericht, praktisch en gericht op duurzame
          vooruitgang. Wij werken outreachend en actief in de leefomgeving van
          cliënten. Door stabiliteit te bieden en aanwezig te zijn waar het nodig
          is, creëren wij ruimte voor herstel en ontwikkeling.
        </p>
        <ul>
          <li>Nabijheid en betrouwbaarheid</li>
          <li>Duidelijke en haalbare doelen</li>
          <li>Vroegsignalering van risico&apos;s</li>
          <li>Samenwerking met gemeenten en ketenpartners</li>
          <li>Op- en afschalen van begeleiding wanneer situaties veranderen</li>
          <li>Ondersteuning op alle leefgebieden</li>
        </ul>
      </SectionBlock>

      {/* Parallax: coffee/calm */}
      <ParallaxDivider
        image="/images/pjprofessionals6.jpg"
        height="h-[35vh]"
        overlay="from-navy/50 via-transparent to-navy/50"
      />

      <SectionBlock id="ketenpartners" title="Ketenpartners" gray>
        <p>
          Wij werken nauw samen met gemeenten, reclassering, GGZ-instellingen,
          maatschappelijke organisaties, FACT-teams en andere regionale partners.
          Door goede samenwerking ontstaat samenhang in het zorgtraject, worden
          risico&apos;s beter beheerst en kunnen wij sneller schakelen wanneer
          situaties veranderen.
        </p>
      </SectionBlock>

      <SectionBlock id="organisatie" title="Organisatiestructuur">
        <h3>Bestuur en directie</h3>
        <p>
          PJ Professionals is opgericht door Paul Spijker en Jeroen Buuts. De
          directie is verantwoordelijk voor strategische keuzes,
          kwaliteitsbewaking en samenwerking met gemeenten en ketenpartners.
        </p>

        <h3>Teamleiders</h3>
        <p>
          Frank Versluis is de teamleider van regio Den Bosch, Anielka Jacobs is
          de teamleider van regio Oss. Onze teamleiders zijn verantwoordelijk
          voor dagelijkse aansturing van de zorgteams, kwaliteitsborging,
          casusregie en inhoudelijke ondersteuning.
        </p>

        <h3>Zorgteams</h3>
        <p>
          Onze zorgteams bestaan uit begeleiders en behandelaren die samenwerken
          binnen de WMO, WLZ en forensische zorg. Zij werken volgens
          professionele richtlijnen, zijn outreachend actief en leveren zowel
          praktische ondersteuning als gedragsinterventies.
        </p>

        <h3>Ondersteunende diensten</h3>
        <p>
          De organisatie wordt ondersteund door administratieve medewerkers, een
          beleidsmedewerker en kwaliteitsmedewerker. Deze diensten zorgen voor
          structuur, veiligheid, actuele documentatie en soepele interne
          processen.
        </p>
      </SectionBlock>

      <SectionBlock id="duurzaamheid" title="Duurzaamheid" gray>
        <p>
          Binnen PJ Professionals streven wij naar een duurzame manier van
          werken. Dit betekent dat wij bewuste keuzes maken op het gebied van
          materiaalgebruik, mobiliteit, kantoorvoorzieningen en interne
          processen. Wij geloven dat duurzaamheid bijdraagt aan een gezonde
          organisatiecultuur en een toekomstbestendige zorgverlening.
        </p>
      </SectionBlock>

      {/* Parallax: watering can / growth */}
      <ParallaxDivider
        image="/images/pjprofessionals8.jpg"
        height="h-[35vh]"
        overlay="from-navy/60 via-transparent to-navy/60"
      />

      <SectionBlock id="kwaliteit" title="Kwaliteit, audits en certificering">
        <p>
          Om de kwaliteit van onze zorg te waarborgen laten wij periodiek audits
          uitvoeren door onafhankelijke deskundigen. De resultaten worden
          gebruikt om processen te verbeteren en onze dienstverlening te
          versterken.
        </p>
        <p>
          Daarnaast voeren wij jaarlijks een cliënttevredenheidsonderzoek uit. De
          resultaten hiervan geven inzicht in de ervaringen, wensen en
          verbeterpunten die cliënten belangrijk vinden.
        </p>
        <p>
          PJ Professionals is gecertificeerd volgens ISO 9001. Dit bevestigt dat
          wij werken volgens een professioneel en erkend
          kwaliteitsmanagementsysteem.
        </p>
      </SectionBlock>

      <SectionBlock id="privacy" title="AVG & Privacy" gray>
        <p>
          Wij nemen privacy en gegevensbescherming zeer serieus. PJ
          Professionals heeft een Functionaris Gegevensbescherming die toeziet op
          naleving van de privacyregels. Wij beschikken over een
          verwerkingsregister, voeren interne controles uit en zorgen dat
          medewerkers getraind zijn in veilig en zorgvuldig handelen.
        </p>
      </SectionBlock>

      <SectionBlock id="clientenraad" title="Cliëntenraad">
        <p>
          De cliëntenraad vertegenwoordigt de stem van cliënten en denkt mee over
          beleid, kwaliteit en verbeterpunten. De raad komt meerdere keren per
          jaar bijeen en geeft adviezen aan het management om de zorg continu te
          verbeteren.
        </p>
      </SectionBlock>
    </>
  );
}
