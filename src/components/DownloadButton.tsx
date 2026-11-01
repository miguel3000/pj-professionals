import type { SiteDocument } from "@/lib/documents";

export default function DownloadButton({ doc, label }: { doc: SiteDocument; label?: string }) {
  return (
    <div className="not-prose mt-4">
      <a
        href={doc.href}
        download={doc.filename}
        className="inline-flex items-center gap-2 rounded-full bg-teal-dark px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {label ?? `Download ${doc.title}`}
        <span className="text-white/60 font-normal">{doc.size}</span>
      </a>
    </div>
  );
}
