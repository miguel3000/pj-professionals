"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

type Props = {
  authenticated: boolean;
  email: string;
  logoB64: string;
};

// ── Signature HTML builder ────────────────────────────────────────────────
function buildSignatureHTML(
  naam: string,
  functie: string,
  mobiel: string,
  telefoon: string,
  email: string,
  werkdagen: string[],
  vestiging: string,
  logoB64: string
): string {
  const logoSrc = `data:image/png;base64,${logoB64}`;
  const vestigingLabel: Record<string, string> = {
    denbosch: "Den Bosch",
    oss: "Oss",
    beide: "Den Bosch &amp; Oss",
  };

  let contactRows = "";
  if (mobiel)
    contactRows += `\n        <tr><td style="padding:0 0 3px 0;color:#333333;font-size:13px;font-family:Arial,Helvetica,sans-serif;white-space:nowrap;">M:&nbsp;<a href="tel:${mobiel.replace(/\s/g, "")}" style="color:#1b1447;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">${mobiel}</a></td></tr>`;
  if (telefoon)
    contactRows += `\n        <tr><td style="padding:0 0 3px 0;color:#333333;font-size:13px;font-family:Arial,Helvetica,sans-serif;white-space:nowrap;">T:&nbsp;<a href="tel:${telefoon.replace(/\s/g, "")}" style="color:#1b1447;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">${telefoon}</a></td></tr>`;
  if (email)
    contactRows += `\n        <tr><td style="padding:0 0 3px 0;color:#333333;font-size:13px;font-family:Arial,Helvetica,sans-serif;white-space:nowrap;">E:&nbsp;<a href="mailto:${email}" style="color:#1b1447;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">${email}</a></td></tr>`;
  if (werkdagen.length > 0)
    contactRows += `\n        <tr><td style="padding:0 0 3px 0;color:#333333;font-size:13px;font-family:Arial,Helvetica,sans-serif;">Werkdagen:&nbsp;${werkdagen.join(", ")}</td></tr>`;
  if (vestiging && vestigingLabel[vestiging])
    contactRows += `\n        <tr><td style="padding:0 0 3px 0;color:#333333;font-size:13px;font-family:Arial,Helvetica,sans-serif;">Vestiging:&nbsp;${vestigingLabel[vestiging]}</td></tr>`;

  return `<table cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-collapse:collapse;">
  <tr>
    <td style="padding:12px 0 12px 14px;vertical-align:middle;">
      <img src="${logoSrc}" width="80" height="80" alt="PJ Professionals" style="display:block;border:0;outline:none;width:80px;height:80px;">
    </td>
    <td style="padding:0 12px;vertical-align:middle;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 auto;">
        <tr><td style="background-color:#1b1447;width:2px;height:75px;font-size:0;line-height:0;padding:0;">&nbsp;</td></tr>
      </table>
    </td>
    <td style="padding:12px 14px 12px 0;vertical-align:top;">
      <p style="margin:0 0 2px 0;font-weight:bold;color:#1b1447;font-size:15px;line-height:1.3;font-family:Arial,Helvetica,sans-serif;">${naam || "Uw naam"}</p>
      <p style="margin:0 0 10px 0;color:#666666;font-size:13px;line-height:1.3;font-family:Arial,Helvetica,sans-serif;">${functie || "Functie"}</p>
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${contactRows}
      </table>
      <p style="margin:8px 0 0 0;font-family:Arial,Helvetica,sans-serif;"><a href="https://www.pjprofessionals.nl" style="color:#1b1447;font-size:13px;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">www.pjprofessionals.nl</a></p>
    </td>
  </tr>
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
const VESTIGINGEN = [
  { value: "denbosch", label: "Den Bosch" },
  { value: "oss", label: "Oss" },
  { value: "beide", label: "Beide" },
];

function Generator({ email: userEmail, logoB64 }: { email: string; logoB64: string }) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);

  const [naam, setNaam] = useState("");
  const [functie, setFunctie] = useState("");
  const [mobiel, setMobiel] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [emailField, setEmailField] = useState(userEmail);
  const [werkdagen, setWerkdagen] = useState<string[]>([]);
  const [vestiging, setVestiging] = useState("");
  const [copied, setCopied] = useState(false);

  const signature = buildSignatureHTML(naam, functie, mobiel, telefoon, emailField, werkdagen, vestiging, logoB64);

  const toggleDag = useCallback((dag: string) => {
    setWerkdagen((prev) => prev.includes(dag) ? prev.filter((d) => d !== dag) : [...prev, dag]);
  }, []);

  async function copyHtml() {
    await navigator.clipboard.writeText(signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  async function downloadPng() {
    if (!previewRef.current) return;
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(previewRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const filename = `handtekening-${naam.replace(/\s+/g, "-").toLowerCase() || "pj"}.png`;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = filename;
    a.click();
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

            <Field label="Functie" required>
              <input type="text" value={functie} onChange={(e) => setFunctie(e.target.value)}
                placeholder="Bijv. Trajectbegeleider" className={inputCls} />
            </Field>

            <hr className="border-gray-100" />

            <Field label="Mobiel nummer">
              <input type="tel" value={mobiel} onChange={(e) => setMobiel(e.target.value)}
                placeholder="Bijv. 06-12345678" className={inputCls} />
            </Field>

            <Field label="Direct telefoonnummer">
              <input type="tel" value={telefoon} onChange={(e) => setTelefoon(e.target.value)}
                placeholder="Bijv. 073-1234567" className={inputCls} />
            </Field>

            <Field label="E-mailadres" required>
              <input type="email" value={emailField} onChange={(e) => setEmailField(e.target.value)}
                placeholder="naam@pjprofessionals.nl" className={inputCls} />
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

            <Field label="Vestiging">
              <div className="flex gap-2 flex-wrap mt-0.5">
                {VESTIGINGEN.map((v) => (
                  <button
                    key={v.value}
                    type="button"
                    onClick={() => setVestiging(vestiging === v.value ? "" : v.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      vestiging === v.value
                        ? "bg-teal-dark border-teal-dark text-white"
                        : "border-gray-200 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    {v.label}
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
                {copied ? "Gekopieerd!" : "Kopieer HTML handtekening"}
              </button>
              <button
                onClick={downloadPng}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download als PNG
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="border-t border-gray-100 px-5 py-4">
            <p className="text-xs font-semibold text-teal-dark uppercase tracking-widest mb-3">
              Handtekening instellen
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <Instruction title="Gmail / Google Workspace">
                Instellingen → Alle instellingen → Algemeen → Handtekening → plak HTML via{" "}
                <code className="bg-gray-100 px-1 rounded">&lt;&gt;</code>-knop of direct in het veld.
                Sla op onderaan de pagina.
              </Instruction>
              <Instruction title="Outlook (Windows)">
                Bestand → Opties → E-mail → Handtekeningen → Nieuw → plak HTML via de{" "}
                <code className="bg-gray-100 px-1 rounded">HTML</code>-knop in de werkbalk. Werkt niet? Gebruik de PNG.
              </Instruction>
              <Instruction title="Apple Mail (Mac)">
                Gebruik de <strong>PNG</strong>: Mail → Voorkeuren → Handtekeningen → sleep de PNG naar het handtekeningveld.
              </Instruction>
              <Instruction title="Outlook (Mac / Microsoft 365)">
                Voorkeuren → Handtekeningen → Nieuw →{" "}
                <code className="bg-gray-100 px-1 rounded">⌘ Shift H</code> voor HTML-modus → plak de HTML.
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
export default function HandtekeningClient({ authenticated, email, logoB64 }: Props) {
  if (!authenticated) return <LoginForm />;
  return <Generator email={email} logoB64={logoB64} />;
}
