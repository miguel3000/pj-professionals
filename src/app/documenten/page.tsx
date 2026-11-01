import PageHero from "@/components/PageHero";
import { privacyverklaring, klachtenreglement, clienttevredenheid, kwaliteitsverslagen, type SiteDocument } from "@/lib/documents";

// One drop-down per document; the title is the plain document name (no company name).
const groups: { title: string; summary: string; docs: SiteDocument[] }[] = [
  { title: "Privacyverklaring", summary: privacyverklaring.description, docs: [privacyverklaring] },
  { title: "Klachtenreglement", summary: klachtenreglement.description, docs: [klachtenreglement] },
  {
    title: "Kwaliteitsjaarverslag Forensische Zorg",
    summary: "Onze kwaliteitsjaarverslagen over de forensische zorg, per jaar.",
    docs: kwaliteitsverslagen,
  },
  { title: "Cliënttevredenheidsonderzoek", summary: clienttevredenheid.description, docs: [clienttevredenheid] },
];

export const metadata = {
  title: "Documenten - PJ Professionals",
  description:
    "Publiek beschikbare formulieren en documenten voor download.",
};

export default function Documenten() {
  return (
    <>
      <PageHero
        badge="Downloads"
        title="Documenten"
        subtitle="Publiek beschikbare formulieren en documenten."
      />
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {groups.map((group) => (
            <details
              key={group.title}
              className="group rounded-2xl border border-gray-200 bg-teal-surface open:bg-white open:shadow-sm transition-colors"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 sm:p-8 [&::-webkit-details-marker]:hidden">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-teal-dark">{group.title}</h2>
                  <p className="mt-1 text-sm text-gray-500">{group.summary}</p>
                </div>
                <svg
                  className="w-5 h-5 shrink-0 text-teal-dark transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <ul className="border-t border-gray-100 px-6 sm:px-8 pb-2">
                {group.docs.map((doc) => (
                  <li key={doc.href} className="border-b border-gray-100 last:border-b-0">
                    <a
                      href={doc.href}
                      download={doc.filename}
                      className="flex items-center justify-between gap-4 py-4 group/link"
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <svg className="w-6 h-6 text-teal-dark shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-medium text-teal-dark group-hover/link:text-teal-medium transition-colors truncate">{doc.title}</span>
                      </span>
                      <span className="inline-flex items-center gap-2 shrink-0 text-sm font-medium text-teal-dark group-hover/link:text-teal-medium transition-colors">
                        <span className="hidden sm:inline text-xs font-normal text-gray-400">{doc.size}</span>
                        Download
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
