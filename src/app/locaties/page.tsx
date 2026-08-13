import PageHero from "@/components/PageHero";
import SectionBlock from "@/components/SectionBlock";

export const metadata = {
  title: "Locaties - PJ Professionals",
  description: "PJ Professionals is gevestigd in 's-Hertogenbosch en Oss.",
};

export default function Locaties() {
  return (
    <>
      <PageHero
        badge="Locaties"
        title="Onze locaties"
        subtitle="PJ Professionals is actief in regio Den Bosch en Oss."
        image="/images/locaties.jpg"
      />

      <SectionBlock title="Onze locaties" gray>
        <div className="not-prose grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <a href="https://maps.google.com/?q=Bruistensingel+130,+5232+AC+s-Hertogenbosch" target="_blank" rel="noopener noreferrer" className="block group">
              <h3 className="font-semibold text-teal-dark text-lg mb-3 group-hover:underline">&apos;s-Hertogenbosch</h3>
              <p className="text-gray-600 text-sm mb-4 group-hover:text-teal-dark transition-colors">Bruistensingel 130, 5232 AC &apos;s-Hertogenbosch</p>
            </a>
            <div className="space-y-2 text-sm text-gray-500">
              <p><strong className="text-teal-dark">Met de auto:</strong> Goed bereikbaar vanaf de A59 en A2. Parkeren mogelijk in de directe omgeving.</p>
              <p><strong className="text-teal-dark">OV:</strong> Neem vanaf station &apos;s-Hertogenbosch bus 4 (Groote Wielen), uitstappen bij halte Bruistensingel. Vanaf hier is het ca. 5 minuten lopen.</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <a href="https://maps.google.com/?q=Raadhuishof+25,+5341+HR+Oss" target="_blank" rel="noopener noreferrer" className="block group">
              <h3 className="font-semibold text-teal-dark text-lg mb-3 group-hover:underline">Oss</h3>
              <p className="text-gray-600 text-sm mb-4 group-hover:text-teal-dark transition-colors">Raadhuishof 25, 5341 HR Oss</p>
            </a>
            <div className="space-y-2 text-sm text-gray-500">
              <p><strong className="text-teal-dark">Met de auto:</strong> Betaald parkeren mogelijk in de directe omgeving. Gratis parkeren bij het Golfbad, Euterpelaan 1, Oss. Vanuit hier is het ca. 5 minuten lopen naar het kantoor.</p>
              <p><strong className="text-teal-dark">OV:</strong> Vanaf station Oss is het ca. 5 minuten lopen.</p>
            </div>
          </div>
        </div>
      </SectionBlock>
    </>
  );
}
