import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Netwerkpartners – PJ Professionals",
  description:
    "PJ Professionals werkt samen met een breed netwerk van partners in de zorg, rechtspraak en het onderwijs.",
};

const partners = [
  {
    name: "Ministerie van Justitie en Veiligheid",
    href: "https://www.rijksoverheid.nl/ministeries/ministerie-van-justitie-en-veiligheid",
    logo: "/logos/partners/ministerie-justitie.png",
  },
  {
    name: "Reclassering Nederland",
    href: "https://www.reclassering.nl",
    logo: "/logos/partners/reclassering-nl.png",
  },
  {
    name: "Leger des Heils",
    href: "https://www.legerdesheils.nl",
    logo: "/logos/partners/leger-des-heils.png",
  },
  {
    name: "SVG Verslavingsreclassering",
    href: "https://www.svg.nl",
    logo: "/logos/partners/svg-verslavingsreclassering.png",
  },
  {
    name: "EFP",
    href: "https://www.efp.nl",
    logo: "/logos/partners/efp.svg",
  },
  {
    name: "KFZ",
    href: "https://www.kfz.nl",
    logo: "/logos/partners/kfz.svg",
  },
  {
    name: "Vecozo",
    href: "https://www.vecozo.nl",
    logo: "/logos/partners/vecozo.png",
    logoClassName: "max-h-36",
  },
  {
    name: "Nedap Ons",
    href: "https://www.nedap-ons.nl",
    logo: "/logos/partners/nedap-ons.png",
  },
  {
    name: "Gemeente Oss",
    href: "https://www.oss.nl",
    logo: "/logos/partners/gemeente-oss.png",
  },
  {
    name: "Gemeente 's-Hertogenbosch",
    href: "https://www.s-hertogenbosch.nl",
    logo: "/logos/partners/s-hertogenbosch.png",
  },
  {
    name: "WMO coöperatie",
    href: "https://www.wmodemeierij.nl",
    logo: "/logos/partners/wmo-cooperatie.png",
  },
  {
    name: "MBO KWI",
    href: "https://www.kw1c.nl",
    logo: "/logos/partners/kw1c.jpg",
  },
  {
    name: "Avans Hogeschool",
    href: "https://www.avans.nl",
    logo: "/logos/partners/avans.webp",
  },
  {
    name: "TVN zorgt",
    href: "https://www.tvnzorgt.nl",
    logo: "/logos/partners/tvn-zorgt.png",
  },
];

export default function Netwerkpartners() {
  return (
    <>
      <PageHero
        badge="Samenwerking"
        title="Netwerkpartners"
        subtitle="PJ Professionals werkt nauw samen met organisaties in de zorg, rechtspraak, gemeenten en het onderwijs om cliënten de beste ondersteuning te bieden."
        image="/images/netwerkpartners.jpg"
      />

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {partners.map((partner) => (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 p-4 min-h-[140px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className={`w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 ${partner.logoClassName ?? "max-h-24"}`}
                  />
                ) : (
                  <span className="text-sm font-semibold text-center text-teal-dark/60 group-hover:text-teal-dark leading-snug transition-colors duration-300">
                    {partner.name}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
