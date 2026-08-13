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

    // Determine recipient
    const toEmail = emailRouting[reason] || "bureaudienst@pjprofessionals.nl";
    const reasonLabel = reasonLabels[reason] || reason;

    // Build email body
    let htmlBody = `
      <h2>Nieuw contactformulier: ${reasonLabel}</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: bold; width: 200px;">Reden van contact</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${reasonLabel}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: bold;">Naam</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${voornaam} ${achternaam}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: bold;">E-mail</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        ${telefoon ? `<tr>
          <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: bold;">Telefoon</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${telefoon}</td>
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
        const label = fieldLabels[key] || key;
        htmlBody += `
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: bold;">${label}</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${value}</td>
        </tr>`;
      }
    }

    if (bericht) {
      htmlBody += `
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: bold;">Bericht</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${bericht.replace(/\n/g, "<br>")}</td>
        </tr>`;
    }

    if (cvBuffer && cvFilename) {
      htmlBody += `
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: bold;">CV</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${cvFilename} (bijgevoegd)</td>
        </tr>`;
    }

    htmlBody += "</table>";

    const transporter = nodemailer.createTransport({
      host: "mail-eu.smtp2go.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: "website@pjprofessionals.nl",
      to: toEmail,
      replyTo: email,
      subject: `Contactformulier: ${reasonLabel} - ${voornaam} ${achternaam}`,
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
