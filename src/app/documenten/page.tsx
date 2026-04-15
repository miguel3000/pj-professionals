import PageHero from "@/components/PageHero";

const documents = [
  {
    title: "WMO Privacyverklaring",
    description: "Hoe wij omgaan met persoonsgegevens binnen de WMO-zorg.",
    href: "/documenten/WMO%20Privacyverklaring.pdf",
    filename: "WMO Privacyverklaring.pdf",
    size: "74 KB",
  },
  {
    title: "WMO Zorgovereenkomst",
    description: "Standaard zorgovereenkomst voor WMO-clienten.",
    href: "/documenten/WMO%20Zorgovereenkomst.pdf",
    filename: "WMO Zorgovereenkomst.pdf",
    size: "108 KB",
  },
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <a
                key={doc.filename}
                href={doc.href}
                download={doc.filename}
                className="block p-8 rounded-2xl border border-gray-200 bg-teal-surface hover:border-teal-dark/20 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <svg
                    className="w-10 h-10 text-teal-dark shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {doc.size}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-teal-dark mb-2 group-hover:text-teal-medium transition-colors">
                  {doc.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {doc.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-teal-dark group-hover:gap-3 transition-all">
                  Download
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
