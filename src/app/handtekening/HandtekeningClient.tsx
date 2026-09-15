"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

type Props = {
  authenticated: boolean;
  email: string;
};

// Hosted, not embedded — a base64 data-URI image is what most email clients
// (Outlook included) silently strip when a signature is captured via
// copy/paste, which is exactly the "not viewable" symptom this was causing.
// A real https URL is how every mainstream signature tool does it. Same
// reasoning applies to every icon below.
const LOGO_URL = "https://www.pjprofessionals.nl/logo-pj-dark.png";
const EMAIL_ICON = "https://www.pjprofessionals.nl/handtekening/email.png";
const GLOBE_ICON = "https://www.pjprofessionals.nl/handtekening/globe.png";
const OFFICE_ICON = "https://www.pjprofessionals.nl/handtekening/office.png";
const PHONE_ICON = "https://www.pjprofessionals.nl/handtekening/phone.png";
const LINKEDIN_ICON = "https://www.pjprofessionals.nl/handtekening/linkedin.png";

const KANTOOR_TEL = "0737621035";
const KANTOOR_EMAIL = "info@pjprofessionals.nl";
// "'s-Hertogenbosch" wrapped in its own nowrap span so a narrow screen
// can't break the line right at the hyphen (confirmed happening in real
// Outlook mobile) — the rest of the address can still wrap normally.
const ADDRESSES = [
  `Bruistensingel 130, 5232 AC <span style="white-space:nowrap;">'s-Hertogenbosch</span>`,
  "Raadhuishof 25, 5341 HR Oss",
];

const CONFIDENTIALITY_TEXT = `Dit e-mailbericht en eventuele bijlagen zijn uitsluitend bestemd voor de geadresseerde(n) en kunnen persoonlijke of vertrouwelijke informatie bevatten die onder een beroepsgeheim of geheimhoudingsplicht valt. Bent u niet de beoogde geadresseerde? Dan verzoeken wij u de afzender hierover te informeren, de inhoud niet te gebruiken, te delen of te verspreiden en het bericht en eventuele bijlagen te verwijderen.`;

// ── Signature HTML builder ────────────────────────────────────────────────
function buildSignatureHTML(
  naam: string,
  functie: string,
  mobiel: string,
  werkdagen: string[]
): string {
  const FONT = "font-family:Arial,Helvetica,sans-serif;";

  // Icon + text rows use a 2-cell table with valign="middle" on both cells
  // rather than inline vertical-align on the img/span — table-cell valign
  // is what reliably centers icon against text across email clients
  // (Outlook included); inline vertical-align:middle on mixed inline
  // content lines up against the line box, not the text's own center.
  // border="0" is the legacy HTML attribute Word's renderer actually checks
  // for — the CSS border:0 alone isn't enough to stop Outlook drawing a
  // default border around a pasted image.
  const iconCell = (icon: string, inner: string) =>
    `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
            <tr>
              <td valign="middle" style="padding:0 6px 0 0;"><img src="${icon}" width="14" height="14" border="0" alt="" style="display:block;border:0;outline:none;"></td>
              <td valign="middle">${inner}</td>
            </tr>
          </table>`;

  // Grouped 2-4-4 (e.g. "06 1234 5678") for readability — mobiel itself
  // stays raw digits (the tel: href needs no spaces, and the input already
  // filters to digits-only on change).
  const formattedMobiel = mobiel.replace(/(\d{2})(\d{4})(\d{0,4})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "));

  let personalRows = "";
  if (mobiel)
    personalRows += `\n        <tr><td style="padding:0 0 3px 0;color:#333333;font-size:13px;${FONT}white-space:nowrap;"><a href="tel:${mobiel}" style="color:#1b1447;text-decoration:none;${FONT}">${formattedMobiel}</a></td></tr>`;
  if (werkdagen.length > 0)
    personalRows += `\n        <tr><td style="padding:0 0 3px 0;"><span style="color:#333333;font-size:11px;${FONT}">werkdagen:&nbsp;${werkdagen.join(", ").toLowerCase()}</span></td></tr>`;

  // Company block is a single stacked column, always — a two-column
  // side-by-side layout with a @media query to collapse it on mobile was
  // tried and confirmed broken in real Outlook: the <style> block doesn't
  // survive Outlook's signature-editor paste, so the two columns kept
  // fighting for space on a phone screen (address/email wrapping mid-word).
  // A single column has nothing to switch, so it renders identically in
  // every client regardless of what survives paste.
  const ROW_HEIGHT = 20;
  const stackedColumn = (rows: string[], padRight: number) =>
    `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${rows
      .map(
        (row, i) => `
      <tr><td height="${ROW_HEIGHT}" valign="middle" style="height:${ROW_HEIGHT}px;padding:0 ${padRight}px ${i < rows.length - 1 ? 6 : 0}px 0;">${row}</td></tr>`
      )
      .join("")}
    </table>`;

  const companyItems = stackedColumn(
    [
      iconCell(OFFICE_ICON, `<span style="color:#333333;font-size:12px;${FONT}">${ADDRESSES[0]}</span>`),
      iconCell(OFFICE_ICON, `<span style="color:#333333;font-size:12px;${FONT}">${ADDRESSES[1]}</span>`),
      iconCell(PHONE_ICON, `<a href="tel:${KANTOOR_TEL}" style="color:#333333;font-size:13px;text-decoration:none;${FONT}">073 762 1035</a>`),
      iconCell(EMAIL_ICON, `<a href="mailto:${KANTOOR_EMAIL}" style="color:#333333;font-size:13px;text-decoration:none;${FONT}">${KANTOOR_EMAIL}</a>`),
      iconCell(GLOBE_ICON, `<a href="https://www.pjprofessionals.nl" style="color:#333333;font-size:13px;text-decoration:none;${FONT}">www.pjprofessionals.nl</a>`),
      `<a href="https://www.linkedin.com/company/pjprofessionals/" style="text-decoration:none;">${iconCell(LINKEDIN_ICON, `<span style="color:#333333;font-size:12px;${FONT}">LinkedIn | PJ Professionals</span>`)}</a>`,
    ],
    0
  );

  const companyRows = `<tr><td style="padding:0 0 0 14px;">${companyItems}</td></tr>`;

  // Greeting is its own block above the logo row now — it used to be the
  // first row inside the text column's nested table (to keep it pinned in
  // place while Naam/Functie/personalRows centered against the logo below
  // it). Pulling it out entirely means the logo row only ever has to center
  // Naam→werkdagen against the logo/divider, one job instead of two.
  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  <tr><td style="padding:0 0 8px 14px;">
    <p style="margin:0;color:#333333;font-size:13px;${FONT}">Met vriendelijke groet,</p>
  </td></tr>
</table>
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  <tr>
    <td style="padding:12px 0 12px 14px;vertical-align:middle;">
      <img src="${LOGO_URL}" width="104" height="104" border="0" alt="PJ Professionals" style="display:block;border:0;outline:none;width:104px;height:104px;">
    </td>
    <td style="padding:0 12px;vertical-align:middle;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 auto;">
        <tr><td style="background-color:#1b1447;width:3px;height:98px;font-size:0;line-height:0;padding:0;">&nbsp;</td></tr>
      </table>
    </td>
    <td style="padding:12px 14px 12px 0;vertical-align:middle;">
      <p style="margin:0 0 2px 0;font-weight:bold;color:#1b1447;font-size:15px;line-height:1.3;${FONT}">${naam || "Uw naam"}</p>
      <p style="margin:0 0 10px 0;color:#666666;font-size:13px;line-height:1.3;${FONT}">${functie || "Functie"}</p>
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${personalRows}
      </table>
    </td>
  </tr>
</table>
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:14px;">
${companyRows}
</table>
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:14px;">
  <tr><td style="height:12px;line-height:12px;font-size:1px;">&nbsp;</td></tr>
  <tr><td style="height:12px;line-height:12px;font-size:1px;">&nbsp;</td></tr>
  <tr><td style="padding:0 24px 4px 14px;"><span style="color:#b3b3b3;font-size:9px;${FONT}">Vertrouwelijkheid</span></td></tr>
  <tr><td style="padding:0 24px 0 14px;line-height:1.5;"><span style="color:#b3b3b3;font-size:9px;${FONT}">${CONFIDENTIALITY_TEXT}</span></td></tr>
</table>`;
}

// ── Login flow ────────────────────────────────────────────────────────────
function LoginForm() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [emailVal, setEmailVal] = useState("");
  const [codeVal, setCodeVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailVal }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setStep("code");
    } catch {
      setError("Er ging iets mis. Probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeVal }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.refresh();
    } catch {
      setError("Er ging iets mis. Probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-dark via-teal-medium to-teal-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
        <div className="flex justify-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-pj-dark.png" alt="PJ Professionals" className="h-16 w-auto" />
        </div>
        <h1 className="text-xl font-bold text-center text-teal-dark mb-1">Handtekening generator</h1>
        <p className="text-sm text-center text-gray-500 mb-8">Inloggen met je PJ-e-mailadres</p>

        {step === "email" ? (
          <form onSubmit={requestCode} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                E-mailadres
              </label>
              <input
                type="email"
                value={emailVal}
                onChange={(e) => setEmailVal(e.target.value)}
                placeholder="naam@pjprofessionals.nl"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-dark transition-colors"
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-teal-dark text-white text-sm font-semibold rounded-lg hover:bg-teal-medium transition-colors disabled:opacity-60"
            >
              {loading ? "Versturen…" : "Stuur inlogcode"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="space-y-4">
            <p className="text-xs text-gray-500 text-center">
              Code verstuurd naar <strong>{emailVal}</strong>. Controleer ook je spam.
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                6-cijferige code
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={codeVal}
                onChange={(e) => setCodeVal(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                required
                autoFocus
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-center tracking-[0.3em] font-mono focus:outline-none focus:border-teal-dark transition-colors"
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-teal-dark text-white text-sm font-semibold rounded-lg hover:bg-teal-medium transition-colors disabled:opacity-60"
            >
              {loading ? "Controleren…" : "Inloggen"}
            </button>
            <button
              type="button"
              onClick={() => { setStep("email"); setError(""); setCodeVal(""); }}
              className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Andere code aanvragen
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Generator ─────────────────────────────────────────────────────────────
const DAYS = ["Ma", "Di", "Wo", "Do", "Vr"];

function Generator({ email: userEmail }: { email: string }) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);

  const [naam, setNaam] = useState("");
  const [functie, setFunctie] = useState("");
  const [mobiel, setMobiel] = useState("");
  const [werkdagen, setWerkdagen] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const signature = buildSignatureHTML(naam, functie, mobiel, werkdagen);

  const toggleDag = useCallback((dag: string) => {
    setWerkdagen((prev) => prev.includes(dag) ? prev.filter((d) => d !== dag) : [...prev, dag]);
  }, []);

  async function copyHtml() {
    // Outlook's signature box (and any rich-text editor) only renders a
    // paste when the clipboard actually carries a text/html entry — a
    // plain-text write just pastes the literal "<table>..." source as
    // visible text, which is what made this "not viewable" before.
    try {
      const plainText = previewRef.current?.innerText ?? signature;
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([signature], { type: "text/html" }),
          "text/plain": new Blob([plainText], { type: "text/plain" }),
        }),
      ]);
    } catch {
      // Older/unsupported browsers: fall back to plain text so the copy
      // action still does *something*, even though pasting it into
      // Outlook won't render as formatted content.
      await navigator.clipboard.writeText(signature);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <header className="bg-teal-dark text-white px-6 py-4 flex items-center gap-4 shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-v24-solo.png" alt="PJ Professionals" className="h-10 w-auto" />
        <div className="flex-1">
          <h1 className="font-bold text-base leading-tight">E-mailhandtekening generator</h1>
          <p className="text-xs text-white/60">Ingelogd als {userEmail}</p>
        </div>
        <button
          onClick={logout}
          className="text-xs text-white/50 hover:text-white/80 transition-colors"
        >
          Uitloggen
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5 items-start">

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 text-xs font-semibold text-teal-dark uppercase tracking-widest">
            Jouw gegevens
          </div>
          <div className="p-5 space-y-4">

            <Field label="Naam" required>
              <input type="text" value={naam} onChange={(e) => setNaam(e.target.value)}
                placeholder="Bijv. Evelien de Vries" className={inputCls} />
            </Field>

            <Field label="Functie">
              <input type="text" value={functie} onChange={(e) => setFunctie(e.target.value)}
                placeholder="Bijv. Trajectbegeleider" className={inputCls} />
            </Field>

            <hr className="border-gray-100" />

            <Field label="Mobiel nummer">
              <input type="tel" value={mobiel} onChange={(e) => setMobiel(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Bijv. 0612345678" className={inputCls} />
              <p className="text-[0.7rem] text-gray-400 mt-1">Alleen cijfers, geen spaties of streepjes.</p>
            </Field>

            <hr className="border-gray-100" />

            <Field label="Werkdagen">
              <div className="flex gap-2 flex-wrap mt-0.5">
                {DAYS.map((dag) => (
                  <button
                    key={dag}
                    type="button"
                    onClick={() => toggleDag(dag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      werkdagen.includes(dag)
                        ? "bg-teal-dark border-teal-dark text-white"
                        : "border-gray-200 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    {dag}
                  </button>
                ))}
              </div>
            </Field>

          </div>
        </div>

        {/* Preview + export */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 text-xs font-semibold text-teal-dark uppercase tracking-widest">
            Voorbeeld handtekening
          </div>
          <div className="p-5">
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-7 mb-4 overflow-x-auto">
              <div ref={previewRef} className="inline-block"
                dangerouslySetInnerHTML={{ __html: signature }} />
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={copyHtml}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-dark text-white text-sm font-semibold rounded-lg hover:bg-teal-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
                {copied ? "Gekopieerd!" : "Kopieer handtekening"}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="border-t border-gray-100 px-5 py-4">
            <p className="text-xs font-semibold text-teal-dark uppercase tracking-widest mb-3">
              Handtekening instellen
            </p>
            <div className="text-xs space-y-2">
              <Instruction title="Outlook (Windows, Mac en web)">
                Klik op <em>Kopieer handtekening</em> hierboven. Ga naar Bestand → Opties → E-mail →
                Handtekeningen → Nieuw, geef een naam, en plak direct in het tekstvak
                (<code className="bg-gray-100 px-1 rounded">Ctrl+V</code> of{" "}
                <code className="bg-gray-100 px-1 rounded">⌘V</code>) — geen aparte HTML-knop nodig,
                de handtekening plakt meteen opgemaakt. Selecteer daarna de handtekening bij{" "}
                <em>Nieuwe berichten</em> en <em>Antwoorden/Doorsturen</em> → OK.
              </Instruction>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────
const inputCls =
  "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-dark transition-colors";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[0.7rem] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function Instruction({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="font-semibold text-gray-700 mb-1">{title}</p>
      <p className="text-gray-500 leading-relaxed">{children}</p>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────
export default function HandtekeningClient({ authenticated, email }: Props) {
  if (!authenticated) return <LoginForm />;
  return <Generator email={email} />;
}
