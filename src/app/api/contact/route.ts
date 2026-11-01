import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const MAX_CV_SIZE = 1.5 * 1024 * 1024; // 1.5MB
const ALLOWED_CV_EXTENSIONS = [".pdf", ".docx"];

function validateCvAttachment(filename: string, buffer: Buffer): string | null {
  const name = filename.toLowerCase();
  const ext = ALLOWED_CV_EXTENSIONS.find((e) => name.endsWith(e));
  if (!ext) return "Alleen .pdf en .docx bestanden zijn toegestaan.";
  if (buffer.length > MAX_CV_SIZE) return "Bestand mag maximaal 1,5 MB zijn.";

  // Magic-byte check: don't trust the client-supplied extension alone.
  const isPdf = buffer.subarray(0, 4).toString("ascii") === "%PDF";
  const isZip = buffer.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04])); // docx is a zip
  if (ext === ".pdf" && !isPdf) return "Bestand is geen geldig PDF-document.";
  if (ext === ".docx" && !isZip) return "Bestand is geen geldig Word-document.";

  return null;
}

// Everything a visitor types ends up in HTML mail: escape it so tags show up as plain text.
function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Review mailbox for blocked submissions, so rejected forms can be reviewed over time.
const ALERT_EMAIL = "alertformPJ@michielmaessen.com";

// Clear attack patterns -> the submission is rejected (and a copy goes to ALERT_EMAIL).
const REJECT_PATTERNS: [RegExp, string][] = [
  [/<\s*\/?\s*(script|iframe|object|embed)\b/i, "script/iframe/object/embed tag"],
  [/<[^>]*\bon[a-z]+\s*=/i, "event handler (on...=) inside a tag"],
  [/\b(href|src|action)\s*=\s*["']?\s*javascript\s*:/i, "javascript: link"],
];
// Any other tag-like text -> the mail is sent, with a warning at the top.
const FLAG_PATTERN = /<\s*\/?\s*[a-z][^>]*>/i;

function scanForHtml(fields: Record<string, unknown>) {
  const rejected: string[] = [];
  const flagged: string[] = [];
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== "string" || !value) continue;
    const hit = REJECT_PATTERNS.find(([re]) => re.test(value));
    if (hit) rejected.push(`${key}: ${hit[1]}`);
    else if (FLAG_PATTERN.test(value)) flagged.push(key);
  }
  return { rejected, flagged };
}

// Strip line breaks from anything used in a mail header (prevents header injection).
const oneLine = (value: unknown) => String(value ?? "").replace(/[\r\n]+/g, " ").trim();

// Mail clients (Outlook especially) don't inherit font settings into table cells and fall back to a tiny
// default, so every cell carries its own family/size.
const FONT = "font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.5; color: #222;";
const LABEL_CELL = `padding: 10px 14px; border: 1px solid #ddd; font-weight: bold; vertical-align: top; background: #f4f7f9; ${FONT}`;
const VALUE_CELL = `padding: 10px 14px; border: 1px solid #ddd; vertical-align: top; ${FONT}`;

// Email routing based on contact reason (from documentation)
const emailRouting: Record<string, string> = {
  aanmelding: "aanmeldingen@pjprofessionals.nl",
  algemeen: "bureaudienst@pjprofessionals.nl",
  sollicitatie: "info@pjprofessionals.nl",
  client: "bureaudienst@pjprofessionals.nl",
  ketenpartner: "bureaudienst@pjprofessionals.nl",
  klacht: "secretariaat@pjprofessionals.nl",
};

const reasonLabels: Record<string, string> = {
  aanmelding: "Aanmelding (door partner/verwijzer)",
  algemeen: "Algemene vraag",
  sollicitatie: "Sollicitatie of stageverzoek",
  client: "Vraag van cliënt",
  ketenpartner: "Overleg voor ketenpartners / verwijzers",
  klacht: "Klacht indienen",
};

function createTransporter() {
  return nodemailer.createTransport({
    host: "mail-eu.smtp2go.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function verifyTurnstileToken(token: string, remoteIp: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("TURNSTILE_SECRET_KEY is not set; skipping captcha verification.");
    return true;
  }
  if (!token) return false;

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);
  if (remoteIp) params.append("remoteip", remoteIp);

  const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: params,
  });
  const outcome = await verifyRes.json();
  return outcome.success === true;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { reason, voornaam, achternaam, email, telefoon, bericht, turnstileToken, cv, cvFilename, ...extraFields } = data;
    delete extraFields.cvMimeType;
    delete extraFields["cf-turnstile-response"]; // hidden input added by the Turnstile widget; verified via turnstileToken

    // Validate required fields
    if (!reason || !voornaam || !achternaam || !email) {
      return NextResponse.json(
        { error: "Vul alle verplichte velden in." },
        { status: 400 }
      );
    }

    // Validate CV attachment, if present
    let cvBuffer: Buffer | null = null;
    if (cv && cvFilename) {
      cvBuffer = Buffer.from(cv, "base64");
      const cvError = validateCvAttachment(cvFilename, cvBuffer);
      if (cvError) {
        return NextResponse.json({ error: cvError }, { status: 400 });
      }
    }

    // Verify captcha to block bots
    const remoteIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const captchaValid = await verifyTurnstileToken(turnstileToken, remoteIp);
    if (!captchaValid) {
      return NextResponse.json(
        { error: "Verificatie is mislukt. Vernieuw de pagina en probeer het opnieuw." },
        { status: 400 }
      );
    }

    // Scan every text field for HTML: clear attacks are rejected (copy kept in ALERT_EMAIL), other tags are flagged.
    const { rejected, flagged } = scanForHtml({ reason, voornaam, achternaam, email, telefoon, bericht, ...extraFields });
    if (rejected.length > 0) {
      try {
        const rows = Object.entries({ reason, voornaam, achternaam, email, telefoon, bericht, ...extraFields })
          .map(([k, v]) => `<tr><td style="${LABEL_CELL}">${esc(k)}</td><td style="${VALUE_CELL}">${esc(v)}</td></tr>`)
          .join("");
        await createTransporter().sendMail({
          from: "website@pjprofessionals.nl",
          to: ALERT_EMAIL,
          subject: oneLine(`[GEBLOKKEERD] Contactformulier: ${esc(reasonLabels[reason] || reason)}`),
          html: `<p style="${FONT}"><strong>Inzending geweigerd</strong> (HTML-aanval).<br>Reden: ${esc(rejected.join("; "))}<br>IP: ${esc(remoteIp)}<br>Tijd: ${esc(new Date().toISOString())}</p>
            <table style="border-collapse: collapse; width: 100%; max-width: 640px;">${rows}</table>`,
        });
      } catch (alertError) {
        console.error("Could not send blocked-submission alert:", alertError);
      }
      console.warn("Contact form rejected:", rejected.join("; "), remoteIp);
      return NextResponse.json(
        { error: "Uw bericht bevat code die wij om veiligheidsredenen niet kunnen verwerken. Verwijder eventuele HTML-code en probeer het opnieuw." },
        { status: 400 }
      );
    }

    // Determine recipient
    const toEmail = emailRouting[reason] || "bureaudienst@pjprofessionals.nl";
    const reasonLabel = esc(reasonLabels[reason] || reason);

    // Build email body
    let htmlBody = flagged.length
      ? `<p style="${FONT} background: #fff4e5; border: 1px solid #f0b86e; padding: 10px 14px; max-width: 640px;"><strong>Let op:</strong> dit bericht bevat HTML-achtige code (veld: ${esc(flagged.join(", "))}). De inhoud is veilig als tekst weergegeven; open geen onverwachte links.</p>`
      : "";
    htmlBody += `
      <h2 style="font-family: Arial, Helvetica, sans-serif; font-size: 20px; color: #0B3C5D; margin: 0 0 16px;">Nieuw contactformulier: ${reasonLabel}</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 640px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.5; color: #222;">
        <tr>
          <td style="${LABEL_CELL} width: 200px;">Reden van contact</td>
          <td style="${VALUE_CELL}">${reasonLabel}</td>
        </tr>
        <tr>
          <td style="${LABEL_CELL}">Naam</td>
          <td style="${VALUE_CELL}">${esc(voornaam)} ${esc(achternaam)}</td>
        </tr>
        <tr>
          <td style="${LABEL_CELL}">E-mail</td>
          <td style="${VALUE_CELL}"><a href="mailto:${esc(email)}">${esc(email)}</a></td>
        </tr>
        ${telefoon ? `<tr>
          <td style="${LABEL_CELL}">Telefoon</td>
          <td style="${VALUE_CELL}">${esc(telefoon)}</td>
        </tr>` : ""}
    `;

    // Add conditional fields based on reason
    const fieldLabels: Record<string, string> = {
      verwijzer: "Naam verwijzer / organisatie",
      functie: "Functie",
      "client-naam": "Naam cliënt",
      "client-leeftijd": "Leeftijd cliënt",
      "client-woonplaats": "Woonplaats cliënt",
      "toelichting-aanmelding": "Toelichting aanmelding",
      "soort-aanvraag": "Soort aanvraag",
      motivatie: "Motivatie / toelichting",
      begeleider: "Naam begeleider",
      organisatie: "Naam organisatie",
      "kp-functie": "Functie",
      onderwerp: "Onderwerp van overleg",
    };

    for (const [key, value] of Object.entries(extraFields)) {
      if (value && key !== "privacy") {
        const label = esc(fieldLabels[key] || key);
        htmlBody += `
        <tr>
          <td style="${LABEL_CELL}">${label}</td>
          <td style="${VALUE_CELL}">${esc(value)}</td>
        </tr>`;
      }
    }

    if (bericht) {
      htmlBody += `
        <tr>
          <td style="${LABEL_CELL}">Bericht</td>
          <td style="${VALUE_CELL}">${esc(bericht).replace(/\r?\n/g, "<br>")}</td>
        </tr>`;
    }

    if (cvBuffer && cvFilename) {
      htmlBody += `
        <tr>
          <td style="${LABEL_CELL}">CV</td>
          <td style="${VALUE_CELL}">${esc(cvFilename)} (bijgevoegd)</td>
        </tr>`;
    }

    htmlBody += "</table>";

    const transporter = createTransporter();

    // Send email
    await transporter.sendMail({
      from: "website@pjprofessionals.nl",
      to: toEmail,
      replyTo: oneLine(email),
      subject: oneLine(`${flagged.length ? "[Let op: HTML] " : ""}Contactformulier: ${reasonLabels[reason] || reason} - ${voornaam} ${achternaam}`),
      html: htmlBody,
      attachments: cvBuffer && cvFilename ? [{ filename: cvFilename, content: cvBuffer }] : undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Er is iets misgegaan bij het versturen. Probeer het later opnieuw." },
      { status: 500 }
    );
  }
}
