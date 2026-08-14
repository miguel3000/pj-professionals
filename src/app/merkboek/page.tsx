import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Merkboek — PJ Professionals",
  robots: { index: false, follow: false },
};

const BASE = "https://www.pjprofessionals.nl";

const LOGOS = [
  {
    src: "/merkboek/logos/PJ-Professionals-logo-wit.png",
    alt: "Volledig logo — wit",
    label: "Volledig logo · wit",
    bg: "#0B3C5D",
    downloadName: "PJ-Professionals-logo-wit.png",
    light: true,
  },
  {
    src: "/merkboek/logos/PJ-Professionals-logo-donker.png",
    alt: "Volledig logo — donker",
    label: "Volledig logo · donker",
    bg: "#E6F2F8",
    downloadName: "PJ-Professionals-logo-donker.png",
    light: false,
  },
  {
    src: "/merkboek/logos/PJ-Professionals-beeldmerk-wit.png",
    alt: "Beeldmerk — wit",
    label: "Beeldmerk · wit",
    bg: "#0A2540",
    downloadName: "PJ-Professionals-beeldmerk-wit.png",
    light: true,
  },
  {
    src: "/merkboek/logos/PJ-Professionals-beeldmerk-donker.png",
    alt: "Beeldmerk — donker",
    label: "Beeldmerk · donker",
    bg: "#FFFFFF",
    downloadName: "PJ-Professionals-beeldmerk-donker.png",
    light: false,
  },
];

const COLORS = [
  { hex: "#0A2540", name: "Nacht",      light: true  },
  { hex: "#0B3C5D", name: "Primair",    light: true  },
  { hex: "#1D5C7A", name: "Diepblauw", light: true  },
  { hex: "#2E86AB", name: "Accent",     light: true  },
  { hex: "#3FA7D6", name: "Lichtblauw",light: true  },
  { hex: "#E6F2F8", name: "Oppervlak", light: false },
  { hex: "#FFFFFF", name: "Wit",        light: false },
];

const DOWNLOADS = [
  { name: "Volledig logo — wit",       file: "PJ-Professionals-logo-wit.png",          size: "667×750 px", bg: "#0B3C5D",  light: true  },
  { name: "Volledig logo — donker",    file: "PJ-Professionals-logo-donker.png",       size: "667×750 px", bg: "#E6F2F8", light: false },
  { name: "Beeldmerk — wit",          file: "PJ-Professionals-beeldmerk-wit.png",     size: "754×750 px", bg: "#0A2540",  light: true  },
  { name: "Beeldmerk — donker",       file: "PJ-Professionals-beeldmerk-donker.png",  size: "754×750 px", bg: "#FFFFFF", light: false },
];

export default function Merkboek() {
  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Playfair Display';
          font-style: normal;
          font-weight: 400 700;
          font-display: swap;
          src: url('/fonts/playfair-display-400.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Playfair Display';
          font-style: italic;
          font-weight: 400;
          font-display: swap;
          src: url('/fonts/playfair-display-400-italic.woff2') format('woff2');
        }
        @font-face {
          font-family: 'DM Sans';
          font-style: normal;
          font-weight: 300 500;
          font-display: swap;
          src: url('/fonts/dmsans-300-500.woff2') format('woff2');
        }
        @font-face {
          font-family: 'DM Sans';
          font-style: italic;
          font-weight: 300;
          font-display: swap;
          src: url('/fonts/dmsans-300-italic.woff2') format('woff2');
        }
        .mb-display { font-family: 'Playfair Display', Georgia, serif; }
        .mb-sans    { font-family: 'DM Sans', system-ui, sans-serif; }
      `}</style>

      {/* ── COVER ─────────────────────────────────────────────────────── */}
      <section style={{ background: "#0A2540", minHeight: "85vh", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "clamp(2rem,5vw,4rem)" }}>
        <Image src="/merkboek/logos/PJ-Professionals-logo-wit.png" alt="PJ Professionals" width={200} height={220} style={{ width: "clamp(100px,18vw,180px)", height: "auto" }} />
        <div style={{ maxWidth: 640 }}>
          <p className="mb-sans" style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#3FA7D6", marginBottom: "1.25rem" }}>Merkboek &amp; Huisstijlgids</p>
          <h1 className="mb-display" style={{ fontSize: "clamp(2.5rem,7vw,5rem)", fontWeight: 700, lineHeight: 1.08, color: "#fff", marginBottom: "1rem" }}>PJ Professionals</h1>
          <p className="mb-sans" style={{ fontSize: "1rem", fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>Richtlijnen voor het gebruik van onze visuele identiteit — logo, kleuren, typografie en beeldtaal. Versie 1.0, 2026.</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <span className="mb-display" style={{ fontStyle: "italic", fontSize: "0.95rem", color: "rgba(255,255,255,0.4)" }}>&ldquo;Een veilige basis om verder te komen.&rdquo;</span>
          <span className="mb-sans" style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>Versie 1.0 · 2026</span>
        </div>
      </section>

      {/* ── 01 LOGO ───────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(3rem,8vw,5rem) clamp(1.5rem,5vw,4rem)", background: "#fff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p className="mb-sans" style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#2E86AB", marginBottom: "0.75rem" }}>01 · Logo</p>
          <h2 className="mb-display" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 700, color: "#0B3C5D", marginBottom: "1rem" }}>Het logo</h2>
          <p className="mb-sans" style={{ fontSize: "1rem", fontWeight: 300, color: "#0A2540", opacity: 0.65, lineHeight: 1.75, maxWidth: 600, marginBottom: "2.5rem" }}>
            Het PJ Professionals logo bestaat uit twee varianten: het volledige logo met woordmerk en het solo beeldmerk. Beide zijn beschikbaar in donker en wit.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.5px", background: "#e0e8ee" }}>
            {LOGOS.map((logo) => (
              <div key={logo.downloadName} style={{ background: logo.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", padding: "3rem 2rem 2rem", minHeight: 260 }}>
                <Image src={logo.src} alt={logo.alt} width={320} height={352} style={{ maxWidth: 160, width: "100%", height: "auto" }} />
                <span className="mb-sans" style={{ fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 500, color: logo.light ? "rgba(255,255,255,0.5)" : "rgba(10,37,64,0.45)" }}>{logo.label}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "2rem", padding: "1.5rem", background: "#E6F2F8", borderRadius: 2 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <p className="mb-sans" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#2E86AB", marginBottom: "0.5rem" }}>Gebruik wel</p>
                {["Logo op wit, oppervlakteblauw of donkerblauw", "Witte versie op donkere achtergronden", "Originele verhoudingen altijd intact houden", "Voldoende witruimte rondom (min. hoogte letter P)"].map(t => (
                  <p key={t} className="mb-sans" style={{ fontSize: "0.82rem", lineHeight: 1.7, color: "#0B3C5D" }}>→ {t}</p>
                ))}
              </div>
              <div>
                <p className="mb-sans" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(10,37,64,0.35)", marginBottom: "0.5rem" }}>Gebruik niet</p>
                {["Logo vervormen, roteren of slagschaduw toevoegen", "Logo in andere kleuren dan wit of donkerblauw", "Elementen van het logo los van elkaar gebruiken", "Logo op drukke foto's zonder overlay"].map(t => (
                  <p key={t} className="mb-sans" style={{ fontSize: "0.82rem", lineHeight: 1.7, color: "#0B3C5D", opacity: 0.55 }}>× {t}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 KLEUREN ────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(3rem,8vw,5rem) clamp(1.5rem,5vw,4rem)", background: "#E6F2F8" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p className="mb-sans" style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#2E86AB", marginBottom: "0.75rem" }}>02 · Kleuren</p>
          <h2 className="mb-display" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 700, color: "#0B3C5D", marginBottom: "1rem" }}>Kleurenpalet</h2>
          <p className="mb-sans" style={{ fontSize: "1rem", fontWeight: 300, color: "#0A2540", opacity: 0.65, lineHeight: 1.75, maxWidth: 600, marginBottom: "2.5rem" }}>
            Ons palet is opgebouwd rond een diepe blauwtintenreeks. Primair (#0B3C5D) is de merkkleur. Accent (#2E86AB) voor links en knoppen.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", borderRadius: 2, overflow: "hidden" }}>
            {COLORS.map((c) => (
              <div key={c.hex} style={{ background: c.hex, padding: "2rem 1.25rem 1.5rem", minHeight: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "0.2rem", border: c.hex === "#FFFFFF" ? "1px solid rgba(11,60,93,0.1)" : undefined }}>
                <span className="mb-sans" style={{ fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.06em", color: c.light ? "#fff" : "#0B3C5D", fontVariantNumeric: "tabular-nums" }}>{c.hex}</span>
                <span className="mb-sans" style={{ fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: c.light ? "rgba(255,255,255,0.55)" : "rgba(11,60,93,0.5)" }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 TYPOGRAFIE ─────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(3rem,8vw,5rem) clamp(1.5rem,5vw,4rem)", background: "#fff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p className="mb-sans" style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#2E86AB", marginBottom: "0.75rem" }}>03 · Typografie</p>
          <h2 className="mb-display" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 700, color: "#0B3C5D", marginBottom: "1rem" }}>Lettertypen</h2>
          <p className="mb-sans" style={{ fontSize: "1rem", fontWeight: 300, color: "#0A2540", opacity: 0.65, lineHeight: 1.75, maxWidth: 600, marginBottom: "3rem" }}>
            Playfair Display voor koppen — warm, gezaghebbend, menselijk. DM Sans voor lopende tekst en interface — helder en modern.
          </p>

          <div style={{ marginBottom: "3rem", paddingBottom: "3rem", borderBottom: "1px solid rgba(11,60,93,0.08)" }}>
            <p className="mb-sans" style={{ fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#2E86AB", marginBottom: "0.25rem" }}>Koppen &amp; Display</p>
            <p className="mb-display" style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0B3C5D", marginBottom: "0.2rem" }}>Playfair Display</p>
            <p className="mb-sans" style={{ fontSize: "0.78rem", color: "#0A2540", opacity: 0.45, marginBottom: "1.5rem" }}>Serif — Display / H1–H3</p>
            <p className="mb-display" style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 700, lineHeight: 1.1, color: "#0B3C5D", marginBottom: "0.5rem" }}>Aandacht voor<br />de mens.</p>
            <p className="mb-display" style={{ fontStyle: "italic", fontSize: "1.25rem", fontWeight: 400, color: "#2E86AB", lineHeight: 1.4, marginBottom: "1.5rem" }}>&ldquo;Een veilige basis om verder te komen.&rdquo;</p>
            <p className="mb-display" style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#0A2540", opacity: 0.5 }}>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z &nbsp; a b c d e f g h i j k l m n o p q r s t u v w x y z &nbsp; 0 1 2 3 4 5 6 7 8 9</p>
          </div>

          <div>
            <p className="mb-sans" style={{ fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#2E86AB", marginBottom: "0.25rem" }}>Broodtekst &amp; Interface</p>
            <p className="mb-sans" style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0B3C5D", marginBottom: "0.2rem" }}>DM Sans</p>
            <p className="mb-sans" style={{ fontSize: "0.78rem", color: "#0A2540", opacity: 0.45, marginBottom: "1.5rem" }}>Sans-serif — Body / Labels / Knoppen</p>
            <p className="mb-sans" style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "#0A2540", opacity: 0.7, maxWidth: "52ch", marginBottom: "1.25rem" }}>PJ Professionals begeleidt volwassenen binnen de WMO en forensische zorg. Onze aanpak is outreachend, methodisch en gericht op duurzame verandering.</p>
            <p className="mb-sans" style={{ fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#2E86AB" }}>Bekijk onze aanpak · Contact opnemen · Forensische zorg</p>
          </div>

          {/* Type scale */}
          <div style={{ marginTop: "3rem" }}>
            <p className="mb-sans" style={{ fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#2E86AB", marginBottom: "0.5rem" }}>Typografische schaal</p>
            {[
              { label: "H1",    cls: "mb-display", style: { fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 700, color: "#0A2540" }, text: "Merkboek" },
              { label: "H2",    cls: "mb-display", style: { fontSize: "clamp(1.5rem,3.5vw,2.5rem)", fontWeight: 700, color: "#0B3C5D" }, text: "Forensische zorg" },
              { label: "H3",    cls: "mb-display", style: { fontSize: "1.4rem", fontWeight: 700, color: "#0B3C5D" }, text: "Onze aanpak" },
              { label: "Lead",  cls: "mb-sans",    style: { fontSize: "1.05rem", fontWeight: 300, color: "#0A2540" }, text: "Wij bieden overzicht, structuur en stabiliteit." },
              { label: "Body",  cls: "mb-sans",    style: { fontSize: "1rem", color: "#0A2540" }, text: "PJ Professionals staat bekend om vasthoudendheid en nabijheid." },
              { label: "Klein", cls: "mb-sans",    style: { fontSize: "0.82rem", color: "#0A2540", opacity: 0.55 }, text: "Vestigingen: Den Bosch & Oss · info@pjprofessionals.nl" },
              { label: "Label", cls: "mb-sans",    style: { fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#2E86AB" }, text: "WMO · Forensische zorg · Contact" },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", padding: "0.85rem 0", borderBottom: "1px solid rgba(11,60,93,0.07)" }}>
                <span className="mb-sans" style={{ fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "#2E86AB", minWidth: "4rem", flexShrink: 0, opacity: 0.7 }}>{row.label}</span>
                <span className={row.cls} style={row.style}>{row.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 HANDTEKENING ───────────────────────────────────────────── */}
      <section style={{ padding: "clamp(3rem,8vw,5rem) clamp(1.5rem,5vw,4rem)", background: "#0B3C5D" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p className="mb-sans" style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#3FA7D6", marginBottom: "0.75rem" }}>04 · E-mail</p>
          <h2 className="mb-display" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>E-mail handtekening</h2>
          <p className="mb-sans" style={{ fontSize: "1rem", fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: 560, marginBottom: "2rem" }}>
            PJ medewerkers kunnen hun professionele e-mailhandtekening aanmaken via de handtekening generator. Vul naam, functie en contactgegevens in en kopieer de HTML direct naar Outlook.
          </p>
          <p className="mb-sans" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", marginBottom: "2rem" }}>
            De pagina is alleen toegankelijk voor medewerkers met inloggegevens.
          </p>
          <Link href="/handtekening" style={{ display: "inline-block", padding: "0.7rem 1.5rem", background: "#fff", color: "#0B3C5D", fontFamily: "inherit", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", borderRadius: 2 }}>
            Naar de handtekening generator →
          </Link>
        </div>
      </section>

      {/* ── 05 DOWNLOADS ──────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(3rem,8vw,5rem) clamp(1.5rem,5vw,4rem)", background: "#0A2540" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p className="mb-sans" style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#3FA7D6", marginBottom: "0.75rem" }}>05 · Downloads</p>
          <h2 className="mb-display" style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>Logo bestanden</h2>
          <p className="mb-sans" style={{ fontSize: "1rem", fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, maxWidth: 560, marginBottom: "2.5rem" }}>
            Download de logo&apos;s als PNG met transparante achtergrond. Voor vectorbestanden neem contact op met de directie.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1px", background: "rgba(255,255,255,0.06)" }}>
            {DOWNLOADS.map((d) => (
              <div key={d.file} style={{ background: "rgba(255,255,255,0.03)", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ background: d.bg, padding: "1rem", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 80, border: d.bg === "#FFFFFF" ? "1px solid rgba(255,255,255,0.1)" : undefined }}>
                  <Image src={`/merkboek/logos/${d.file}`} alt={d.name} width={160} height={176} style={{ maxWidth: 80, maxHeight: 80, width: "auto", height: "auto", objectFit: "contain" }} />
                </div>
                <div>
                  <p className="mb-sans" style={{ fontSize: "0.85rem", fontWeight: 500, color: "#fff" }}>{d.name}</p>
                  <p className="mb-sans" style={{ fontSize: "0.68rem", letterSpacing: "0.06em", color: "rgba(255,255,255,0.3)", marginTop: "0.2rem" }}>PNG · transparant · {d.size}</p>
                </div>
                <a href={`${BASE}/merkboek/logos/${d.file}`} download={d.file} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3FA7D6", textDecoration: "none", border: "1px solid rgba(63,167,214,0.3)", padding: "0.45rem 0.85rem", borderRadius: 2, width: "fit-content" }}>
                  ↓ Download
                </a>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <a href={`${BASE}/merkboek/PJ-Professionals-Merkboek.pdf`} download="PJ-Professionals-Merkboek.pdf" style={{ display: "inline-block", padding: "0.7rem 1.5rem", background: "#fff", color: "#0B3C5D", fontFamily: "inherit", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", borderRadius: 2, marginBottom: "2rem" }}>
              ↓ Download deze gids als PDF
            </a>
            <p className="mb-sans" style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", lineHeight: 1.8 }}>
              Lettertypen: <strong style={{ color: "rgba(255,255,255,0.45)" }}>Playfair Display</strong> (<a href={`${BASE}/fonts/playfair-display.ttf`} download style={{ color: "#3FA7D6", textDecoration: "none" }}>.ttf</a>) · <strong style={{ color: "rgba(255,255,255,0.45)" }}>DM Sans</strong> (<a href={`${BASE}/fonts/dmsans.ttf`} download style={{ color: "#3FA7D6", textDecoration: "none" }}>.ttf</a>)<br />
              Vragen over de huisstijl: <strong style={{ color: "rgba(255,255,255,0.45)" }}>info@pjprofessionals.nl</strong>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
