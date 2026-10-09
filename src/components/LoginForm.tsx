"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ title }: { title: string }) {
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
        <h1 className="text-xl font-bold text-center text-teal-dark mb-1">{title}</h1>
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
