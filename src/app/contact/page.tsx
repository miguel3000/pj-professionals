"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import PageHero from "@/components/PageHero";
import SectionBlock from "@/components/SectionBlock";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const MAX_CV_SIZE = 1.5 * 1024 * 1024; // 1.5MB
const ALLOWED_CV_EXTENSIONS = [".pdf", ".docx"];

function validateCvFile(file: File): string | undefined {
  const name = file.name.toLowerCase();
  if (!ALLOWED_CV_EXTENSIONS.some((ext) => name.endsWith(ext))) {
    return "Alleen .pdf en .docx bestanden zijn toegestaan.";
  }
  if (file.size > MAX_CV_SIZE) {
    return "Bestand mag maximaal 1,5 MB zijn.";
  }
  return undefined;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

const contactReasons = [
  { value: "", label: "Selecteer een reden..." },
  { value: "aanmelding", label: "Aanmelding (door partner/verwijzer)" },
  { value: "algemeen", label: "Algemene vraag" },
  { value: "sollicitatie", label: "Sollicitatie of stageverzoek" },
  { value: "client", label: "Vraag van cliënt" },
  { value: "ketenpartner", label: "Overleg voor ketenpartners / verwijzers" },
  { value: "klacht", label: "Klacht indienen" },
];

function InputField({
  label,
  id,
  type = "text",
  placeholder,
  required,
  error,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm ${error ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20" : "border-gray-200 focus:border-teal-dark focus:ring-2 focus:ring-teal-dark/20"}`}
      />
      {error && <p data-field-error className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function TextAreaField({
  label,
  id,
  placeholder,
  rows = 4,
}: {
  label: string;
  id: string;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-dark focus:ring-2 focus:ring-teal-dark/20 outline-none transition-all text-sm resize-none"
      />
    </div>
  );
}

export default function Contact() {
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | undefined>(undefined);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState("");
  const cvInputRef = useRef<HTMLInputElement>(null);

  function handleCvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setCvFile(null);
      setCvError("");
      return;
    }
    const error = validateCvFile(file);
    if (error) {
      setCvError(error);
      setCvFile(null);
      if (cvInputRef.current) cvInputRef.current.value = "";
      return;
    }
    setCvError("");
    setCvFile(file);
  }

  function clearCvFile() {
    setCvFile(null);
    setCvError("");
    if (cvInputRef.current) cvInputRef.current.value = "";
  }

  function renderTurnstile() {
    if (!TURNSTILE_SITE_KEY || !window.turnstile || !turnstileContainerRef.current) return;
    if (turnstileContainerRef.current.childElementCount > 0) return;
    turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: "light",
      callback: (token) => {
        setTurnstileToken(token);
        setFieldErrors((prev) => ({ ...prev, turnstile: "" }));
      },
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => setTurnstileToken(""),
    });
  }

  useEffect(() => {
    if (status !== "success") renderTurnstile();
  }, [status]);

  function validate(data: Record<string, string>) {
    const errors: Record<string, string> = {};
    if (!data.reason) errors.reason = "Selecteer een reden van contact.";
    if (!data.voornaam?.trim()) errors.voornaam = "Voornaam is verplicht.";
    if (!data.achternaam?.trim()) errors.achternaam = "Achternaam is verplicht.";
    if (!data.email?.trim()) {
      errors.email = "E-mailadres is verplicht.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Voer een geldig e-mailadres in.";
    }
    if (!data.privacy) errors.privacy = "U moet akkoord gaan met de privacyverklaring.";
    if (TURNSTILE_SITE_KEY && !data.turnstileToken) {
      errors.turnstile = "Voltooi de verificatie hieronder.";
    }
    return errors;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });
    data.reason = reason;
    data.turnstileToken = turnstileToken;
    delete data.cv;

    const errors = validate(data);
    if (reason === "sollicitatie" && cvFile) {
      const cvFileError = validateCvFile(cvFile);
      if (cvFileError) errors.cv = cvFileError;
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTimeout(() => {
        const first = document.querySelector("[data-field-error]");
        first?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }
    setFieldErrors({});
    setStatus("sending");
    setErrorMessage("");

    try {
      if (reason === "sollicitatie" && cvFile) {
        data.cv = await fileToBase64(cvFile);
        data.cvFilename = cvFile.name;
        data.cvMimeType = cvFile.type;
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const result = await res.json();
        setErrorMessage(result.error || "Er is iets misgegaan.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Kan geen verbinding maken met de server. Probeer het later opnieuw.");
      setStatus("error");
    } finally {
      setTurnstileToken("");
      if (window.turnstile) window.turnstile.reset(turnstileWidgetId.current);
    }
  }

  return (
    <>
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          onLoad={renderTurnstile}
        />
      )}
      <PageHero
        badge="Contact"
        title="Neem contact met ons op"
        subtitle="PJ Professionals is bereikbaar voor cliënten, verwijzers en ketenpartners via telefoon, e-mail en ons contactformulier."
        image="/images/Contact.jpg"
      />

      {/* Contact info cards */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-teal-surface rounded-2xl p-6 border border-gray-100 text-center">
              <div className="w-12 h-12 rounded-xl bg-teal-dark/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-teal-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-teal-dark mb-1">Bureaudienst</h3>
              <a href="tel:073-7621035" className="text-teal-medium text-sm hover:underline">073 - 762 1035</a>
              <p className="text-gray-400 text-xs mt-1">Tijdens kantooruren</p>
            </div>

            <div className="bg-teal-surface rounded-2xl p-6 border border-gray-100 text-center">
              <div className="w-12 h-12 rounded-xl bg-teal-dark/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-teal-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-teal-dark mb-1">E-mail</h3>
              <a href="mailto:bureaudienst@pjprofessionals.nl" className="text-teal-medium text-sm hover:underline">bureaudienst@pjprofessionals.nl</a>
            </div>

            <div className="bg-teal-surface rounded-2xl p-6 border border-gray-100 text-center sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 rounded-xl bg-teal-dark/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-teal-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-teal-dark mb-1">Aanmeldingen</h3>
              <a href="mailto:aanmeldingen@pjprofessionals.nl" className="text-teal-medium text-sm hover:underline">aanmeldingen@pjprofessionals.nl</a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-teal-dark mb-2">Contactformulier</h2>
            <p className="text-gray-500 text-sm mb-8">
              Liever telefonisch contact? Onze bureaudienst is bereikbaar tijdens kantooruren via 073-7621035.
            </p>

            {status === "success" ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-teal-dark mb-2">Bericht verzonden!</h3>
                <p className="text-gray-500 text-sm mb-6">Bedankt voor uw bericht. Wij nemen zo snel mogelijk contact met u op.</p>
                <button
                  onClick={() => { setStatus("idle"); setReason(""); setTurnstileToken(""); clearCvFile(); }}
                  className="px-6 py-2.5 bg-teal-dark text-white font-semibold text-sm rounded-xl hover:bg-teal-dark transition-colors"
                >
                  Nieuw bericht versturen
                </button>
              </div>
            ) : (

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Reason selector */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Reden van contact <span className="text-red-400">*</span>
                </label>
                <select
                  id="reason"
                  value={reason}
                  onChange={(e) => { setReason(e.target.value); setFieldErrors(prev => ({ ...prev, reason: "" })); }}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm bg-white ${fieldErrors.reason ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20" : "border-gray-200 focus:border-teal-dark focus:ring-2 focus:ring-teal-dark/20"}`}
                >
                  {contactReasons.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.reason && <p data-field-error className="text-red-500 text-xs mt-1">{fieldErrors.reason}</p>}
              </div>

              {/* Standard fields */}
              <div className="grid sm:grid-cols-2 gap-5">
                <InputField label="Voornaam" id="voornaam" required placeholder="Uw voornaam" error={fieldErrors.voornaam} />
                <InputField label="Achternaam" id="achternaam" required placeholder="Uw achternaam" error={fieldErrors.achternaam} />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <InputField label="E-mailadres" id="email" type="email" required placeholder="uw@email.nl" error={fieldErrors.email} />
                <InputField label="Telefoonnummer" id="telefoon" type="tel" placeholder="06-12345678" />
              </div>

              {/* Conditional fields based on reason */}
              {reason === "aanmelding" && (
                <div className="space-y-5 p-6 bg-teal-surface rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-teal-dark text-sm">Aanmeldgegevens</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <InputField label="Naam verwijzer / organisatie" id="verwijzer" />
                    <InputField label="Functie" id="functie" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <InputField label="Naam cliënt" id="client-naam" />
                    <InputField label="Leeftijd cliënt" id="client-leeftijd" />
                  </div>
                  <InputField label="Woonplaats cliënt" id="client-woonplaats" />
                  <TextAreaField label="Korte toelichting op de aanmelding" id="toelichting-aanmelding" placeholder="Beschrijf de situatie kort..." />
                </div>
              )}

              {reason === "sollicitatie" && (
                <div className="space-y-5 p-6 bg-teal-surface rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-teal-dark text-sm">Sollicitatiegegevens</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Soort aanvraag</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-dark focus:ring-2 focus:ring-teal-dark/20 outline-none transition-all text-sm bg-white">
                      <option value="sollicitatie">Sollicitatie</option>
                      <option value="stage">Stage</option>
                    </select>
                  </div>
                  <TextAreaField label="Motivatie / toelichting" id="motivatie" placeholder="Vertel ons waarom u wilt werken bij PJ Professionals..." />

                  <div>
                    <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Upload hier uw CV
                    </label>
                    {cvFile ? (
                      <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-white text-sm ${cvError ? "border-red-400" : "border-gray-200"}`}>
                        <span className="text-gray-700 truncate">
                          {cvFile.name} <span className="text-gray-400">({(cvFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </span>
                        <button
                          type="button"
                          onClick={clearCvFile}
                          className="text-gray-400 hover:text-red-500 shrink-0 text-xs font-medium"
                        >
                          Verwijderen
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        id="cv"
                        name="cv"
                        ref={cvInputRef}
                        onChange={handleCvChange}
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-sm bg-white file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-teal-dark/10 file:text-teal-dark file:text-xs file:font-semibold hover:file:bg-teal-dark/20 ${(fieldErrors.cv || cvError) ? "border-red-400" : "border-gray-200"}`}
                      />
                    )}
                    <p className="text-gray-400 text-xs mt-1.5">PDF of Word-document, maximaal 1,5 MB.</p>
                    {(fieldErrors.cv || cvError) && (
                      <p data-field-error className="text-red-500 text-xs mt-1">{fieldErrors.cv || cvError}</p>
                    )}
                  </div>
                </div>
              )}

              {reason === "client" && (
                <div className="space-y-5 p-6 bg-teal-surface rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-teal-dark text-sm">Cliëntgegevens</h3>
                  <InputField label="Naam begeleider (indien bekend)" id="begeleider" />
                </div>
              )}

              {reason === "ketenpartner" && (
                <div className="space-y-5 p-6 bg-teal-surface rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-teal-dark text-sm">Gegevens ketenpartner</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <InputField label="Naam organisatie" id="organisatie" />
                    <InputField label="Functie" id="kp-functie" />
                  </div>
                  <InputField label="Onderwerp van overleg" id="onderwerp" />
                </div>
              )}

              {reason === "klacht" && (
                <div className="p-6 bg-teal-surface rounded-xl border border-teal-medium/30 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-teal-dark shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="font-semibold text-teal-dark text-sm">Klachtenprocedure</h3>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Wanneer iets niet naar wens verloopt, horen wij dit graag. De klacht wordt behandeld door een interne klachtencoördinator. Wij zijn tevens aangesloten bij een extern klachtenportaal.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Voor iedereen die contact zoekt geldt, dat wij helder communiceren, snel reageren en zorgvuldig omgaan met alle vragen en signalen.
                  </p>
                </div>
              )}

              {/* Message */}
              <TextAreaField
                label="Bericht / toelichting"
                id="bericht"
                placeholder="Uw vraag of bericht..."
                rows={5}
              />

              {/* Privacy checkbox */}
              <div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    value="yes"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-dark focus:ring-teal-dark"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-600">
                    Ik ga akkoord met de privacyverklaring van PJ Professionals. <span className="text-red-400">*</span>
                  </label>
                </div>
                {fieldErrors.privacy && <p data-field-error className="text-red-500 text-xs mt-1">{fieldErrors.privacy}</p>}
              </div>

              {/* Turnstile captcha */}
              {TURNSTILE_SITE_KEY && (
                <div>
                  <div ref={turnstileContainerRef} className="flex justify-center" />
                  {fieldErrors.turnstile && <p data-field-error className="text-red-500 text-xs mt-1">{fieldErrors.turnstile}</p>}
                </div>
              )}

              {status === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-3.5 bg-gradient-to-r from-teal-dark to-teal-dark text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "sending" ? "Bezig met verzenden..." : "Verstuur bericht"}
              </button>
            </form>
            )}
          </div>
        </div>
      </section>

      {/* Locations */}
      <SectionBlock id="locaties" title="Onze locaties" gray>
        <div className="not-prose grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold text-teal-dark text-lg mb-3">&apos;s-Hertogenbosch</h3>
            <p className="text-gray-600 text-sm mb-4">Bruistensingel 130, 5232 AC &apos;s-Hertogenbosch</p>
            <div className="space-y-2 text-sm text-gray-500">
              <p><strong className="text-teal-dark">Met de auto:</strong> Goed bereikbaar vanaf de A59 en A2. Parkeren mogelijk in de directe omgeving.</p>
              <p><strong className="text-teal-dark">OV:</strong> Neem vanaf station &apos;s-Hertogenbosch bus 4 (Groote Wielen), uitstappen bij halte Bruistensingel. Vanaf hier is het ca. 5 minuten lopen.</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="font-semibold text-teal-dark text-lg mb-3">Oss</h3>
            <p className="text-gray-600 text-sm mb-4">Raadhuishof 25, 5341 HR Oss</p>
            <div className="space-y-2 text-sm text-gray-500">
              <p><strong className="text-teal-dark">Met de auto:</strong> Betaald parkeren mogelijk in de directe omgeving. Gratis parkeren bij het Golfbad, Euterpelaan 1, Oss. Vanuit hier is het ca. 5 minuten lopen naar het kantoor.</p>
              <p><strong className="text-teal-dark">OV:</strong> Vanaf station Oss is het ca. 5 minuten lopen.</p>
            </div>
          </div>
        </div>
      </SectionBlock>

      {/* Complaints */}
      <SectionBlock id="klachten" title="Klachtenprocedure">
        <p>
          Wanneer iets niet naar wens verloopt, horen wij dit graag. Cliënten
          kunnen hun klacht indienen via ons contactformulier (kies voor klacht indienen). De klacht wordt behandeld door een interne klachtencoördinator. Wij
          zijn tevens aangesloten bij een extern klachtenportaal.
        </p>
      </SectionBlock>
    </>
  );
}
