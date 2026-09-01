import PageHero from "@/components/PageHero";
import SectionBlock from "@/components/SectionBlock";
import ParallaxDivider from "@/components/ParallaxDivider";
import Link from "next/link";

export const metadata = {
  title: "WLZ - PJ Professionals",
  description:
    "PJ Professionals biedt ambulante begeleiding binnen de Wet langdurige zorg (Wlz) via een persoonsgebonden budget.",
};

export default function WlzZorg() {
  return (
    <>
      <PageHero
        badge="WLZ"
        title="Wet langdurige zorg"
        subtitle="De Wet langdurige zorg (Wlz) is bedoeld voor mensen die blijvend intensieve zorg nodig hebben. Wij bieden ambulante begeleiding binnen de Wlz via een persoonsgebonden budget."
        image="/images/wlz.jpg"
      />

      <SectionBlock id="wat-is-wlz" title="Wet langdurige zorg (Wlz)">
        <p>
          De Wet langdurige zorg (Wlz) is bedoeld voor mensen die blijvend
          intensieve zorg nodig hebben. Een Wlz-indicatie kan worden
          afgegeven wanneer iemand vanwege een ziekte, aandoening, beperking
          of psychische stoornis blijvend behoefte heeft aan permanent
          toezicht of 24 uur per dag zorg in de nabijheid.
        </p>
        <p>
          Het Centrum Indicatiestelling Zorg (CIZ) beoordeelt of iemand in
          aanmerking komt voor een Wlz-indicatie. Daarbij onderzoekt het CIZ
          onder meer de aard en ernst van de aandoening of beperking, de
          zorgbehoefte en de vraag of deze behoefte blijvend is.
        </p>
        <p>
          PJ Professionals biedt binnen de Wlz uitsluitend individuele
          ambulante begeleiding via een persoonsgebonden budget (pgb). Wij
          leveren geen zorg in natura en bieden geen verblijf, nachtzorg,
          24-uurszorg of permanent toezicht. Onze begeleiding kan onderdeel
          zijn van de totale zorg die een cliënt vanuit de Wlz ontvangt.
        </p>
        <p>
          Onze ambulante begeleiding vindt plaats in de eigen leefomgeving en
          kan onder andere bestaan uit:
        </p>
        <ul>
          <li>het aanbrengen van structuur en een passende dagplanning;</li>
          <li>ondersteuning bij zelfredzaamheid en dagelijkse vaardigheden;</li>
          <li>begeleiding bij administratie en praktische zaken;</li>
          <li>hulp bij het behouden van overzicht en stabiliteit;</li>
          <li>
            ondersteuning bij sociale contacten en maatschappelijke
            participatie;
          </li>
          <li>
            begeleiding bij afspraken, communicatie en het organiseren van
            zorg;
          </li>
          <li>het versterken van zelfstandigheid en eigen regie.</li>
        </ul>
        <p>
          De begeleiding wordt afgestemd op de persoonlijke situatie,
          zorgbehoefte en doelen van de cliënt. Uitgangspunt is dat de
          ondersteuning praktisch toepasbaar is en bijdraagt aan het
          dagelijks functioneren.
        </p>
        <p>
          Heeft u een Wlz-indicatie en een persoonsgebonden budget, of wilt u
          weten of onze ambulante begeleiding aansluit bij uw situatie? Neem
          dan contact met ons op.
        </p>
      </SectionBlock>

      {/* CTA with parallax */}
      <ParallaxDivider
        image="/images/pjprofessionals8-alt.jpg"
        height="h-auto"
        overlay="from-teal-dark/80 via-teal-dark/60 to-teal-dark/80"
      >
        <div className="py-16">
          <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
            Meer weten over WLZ?
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
