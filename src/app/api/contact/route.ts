import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { reason, voornaam, achternaam, email, telefoon, bericht, ...extraFields } = data;

    // Validate required fields
    if (!reason || !voornaam || !achternaam || !email) {
      return NextResponse.json(
        { error: "Vul alle verplichte velden in." },
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
      from: process.env.SMTP_USER,
      to: toEmail,
      replyTo: email,
      subject: `Contactformulier: ${reasonLabel} - ${voornaam} ${achternaam}`,
      html: htmlBody,
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
