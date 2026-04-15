import PageHero from "@/components/PageHero";
import SectionBlock from "@/components/SectionBlock";
import ParallaxDivider from "@/components/ParallaxDivider";
import Link from "next/link";

export const metadata = {
  title: "WMO-zorg - PJ Professionals",
  description:
    "WMO-zorg helpt volwassenen zelfstandig te leven en deel te nemen aan de maatschappij.",
};

export default function WmoZorg() {
  return (
    <>
      <PageHero
        badge="WMO-zorg"
        title="Ondersteuning bij zelfstandig leven"
        subtitle="WMO-zorg helpt volwassenen zelfstandig te leven en deel te nemen aan de maatschappij. Wij bieden overzicht, structuur en stabiliteit."
        image="/images/pjprofessionals9.jpg"
      />

      <SectionBlock id="wat-is-wmo" title="Wat is WMO-zorg?">
        <p>
          WMO-zorg helpt volwassenen zelfstandig te leven en deel te nemen aan de
          maatschappij. Veel clienten lopen vast door problemen op meerdere
          leefgebieden. WMO-zorg is er om overzicht, structuur en stabiliteit te
          herstellen.
        </p>
        <p>
          De WMO richt zich op ondersteuning bij wonen, financien, gezondheid,
          sociale relaties, daginvulling en veiligheid. Voor veel clienten die
          bij ons komen, is er sprake van psychiatrische problemen,
          verstandelijke beperkingen, verslaving, langdurige instabiliteit, of
          een combinatie hiervan.
        </p>
        <p>
          Onze WMO-zorg is bestemd voor volwassenen vanaf 18 jaar die
          ondersteuning nodig hebben bij zelfstandig functioneren. Dit kan gaan
          om clienten die kortdurend ondersteuning nodig hebben of langdurige
          hulpvragen, crisissituaties, zorgmijding of wantrouwen richting
          hulpverlening.
        </p>
        <p>
          De rol van de begeleider is overzicht bieden, rust creeren,
          ondersteunen bij praktische taken, motiveren en vroegtijdig signaleren
          van risico&apos;s. Onze begeleiding sluit aan op de leefwereld van de
          client en richt zich op duurzame vooruitgang.
        </p>
      </SectionBlock>

      <SectionBlock id="onze-aanpak" title="Onze aanpak" gray>
        <p>
          Onze aanpak binnen de WMO is gebaseerd op vier pijlers: aansluiten op
          de leefwereld, werken vanuit vertrouwen, actieve aanwezigheid en
          doelgericht handelen.
        </p>
        <p>
          Wij sluiten aan bij de situatie van de client door bij de client thuis
          of elders af te spreken, aanwezig te zijn waar het nodig is en
          ondersteuning te bieden bij dagelijkse uitdagingen. Vertrouwen is de
          basis: wij luisteren zonder oordeel, zijn betrouwbaar en communiceren
          helder.
        </p>
        <p>
          Onze begeleiding is outreachend. Wij zijn actief in de leefomgeving
          van de client, bieden stabiliteit in crisissituaties en blijven
          betrokken bij terugval. Hierdoor ontstaat ruimte voor herstel.
        </p>
        <p>
          Wij werken doelgericht en methodisch met een ondersteuningsplan dat
          samen met de client wordt opgesteld. We ondersteunen op meerdere
          leefgebieden zoals: wonen, financien, gezondheid, relaties,
          daginvulling, veiligheid en toekomstperspectief. Door samenwerking met
          gemeenten en netwerkpartners bieden wij samenhangende zorg.
        </p>
        <p>
          Onze begeleiding wordt opgeschaald wanneer risico&apos;s toenemen en
          af wanneer zelfstandigheid toeneemt. Deze flexibiliteit maakt onze
          aanpak effectief, duurzaam en passend bij de behoeften van de client.
        </p>
      </SectionBlock>

      {/* Parallax: elderly hands */}
      <ParallaxDivider
        image="/images/pjprofessionals4.jpg"
        height="h-[40vh]"
        overlay="from-teal-dark/50 via-transparent to-teal-dark/50"
      />

      <SectionBlock id="voor-wie" title="Voor wie zijn wij er?">
        <p>
          Wij zijn er voor volwassenen vanaf 18 jaar die ondersteuning nodig
          hebben bij zelfstandig functioneren. Dit kunnen clienten zijn met
          psychiatrische problemen, verstandelijke beperkingen, verslaving of
          instabiliteit.
        </p>
        <p>Onze doelgroep bestaat uit:</p>
        <ul>
          <li>Clienten met problemen op een of meerdere leefgebieden</li>
          <li>Clienten die een veilige en stabiele basis nodig hebben</li>
          <li>
            Clienten die eerder niet goed zijn aangesloten in reguliere zorg
          </li>
        </ul>
        <p>
          Wij bieden ook ondersteuning aan clienten met een forensische
          achtergrond waarvan de justitiele maatregel eindigt. Door onze brede
          expertise kunnen wij begeleiding bieden die aansluit op risico&apos;s,
          dagelijkse realiteit en toekomstperspectief.
        </p>
      </SectionBlock>

      <SectionBlock id="aanmelding" title="Aanmelding en werkwijze" gray>
        <p>
          Een WMO-aanmelding start meestal bij de gemeente. Na verwijzing nemen
          wij contact op met de client om een intake te plannen. Tijdens de
          intake bespreken wij problemen, doelen, verwachtingen en veiligheid.
          Wij vullen samen documenten in, zoals de zorgovereenkomst en
          toestemmingsverklaringen.
        </p>
        <p>
          Op basis hiervan stellen wij een ondersteuningsplan op met concrete
          doelen. De begeleiding start met het stabiliseren van de basis: wonen,
          financien, dagstructuur en veiligheid. Wij werken regelmatig samen met
          wijkteams, schuldhulpverlening, geestelijke gezondheidszorg en
          maatschappelijke organisaties. Wij schalen zorg op wanneer
          risico&apos;s toenemen en af wanneer zelfstandigheid toeneemt.
        </p>
        <p>
          De eigen bijdrage aan het Centraal Administratie Kantoor is
          afhankelijk van het inkomen. Wij verwijzen clienten naar de landelijke
          informatiepagina voor uitleg over deze bijdrage.
        </p>
      </SectionBlock>

      {/* Parallax: holding hands close-up */}
      <ParallaxDivider
        image="/images/pjprofessionals10.jpg"
        height="h-[35vh]"
        overlay="from-teal-dark/60 via-transparent to-teal-dark/60"
      />

      <SectionBlock id="veelgestelde-vragen" title="Veelgestelde vragen WMO">
        <div className="space-y-4 not-prose">
          {[
            {
              q: "Wat houdt WMO-zorg in?",
              a: "WMO-zorg ondersteunt volwassenen die moeite hebben om zelfstandig te functioneren. Het doel is stabiliteit, structuur en deelname aan de maatschappij.",
            },
            {
              q: "Hoe meld ik mij aan?",
              a: "Aanmeldingen lopen via de gemeente. Na verwijzing nemen wij contact op voor een intake.",
            },
            {
              q: "Zijn er kosten aan verbonden?",
              a: "De bijdrage wordt bepaald door het Centraal Administratie Kantoor op basis van inkomen.",
            },
            {
              q: "Hoe lang duurt begeleiding?",
              a: "Dit verschilt per persoon. Sommige trajecten zijn kortdurend, andere langdurig.",
            },
            {
              q: "Werken jullie samen met andere instanties?",
              a: "Ja, wij werken nauw samen met gemeenten, wijkteams, geestelijke gezondheidszorg en maatschappelijke organisaties.",
            },
            {
              q: "Wat gebeurt er bij terugval?",
              a: "Wij blijven betrokken. Terugval is soms onderdeel van herstel. Wij passen de begeleiding aan wanneer dat nodig is.",
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

      {/* CTA with parallax */}
      <ParallaxDivider
        image="/images/pjprofessionals8.jpg"
        height="h-auto"
        overlay="from-teal-dark/80 via-teal-dark/60 to-teal-dark/80"
      >
        <div className="py-16">
          <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
            Meer weten over WMO-zorg?
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
