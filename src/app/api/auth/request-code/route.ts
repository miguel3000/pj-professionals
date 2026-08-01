import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { signOtpToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email || !String(email).toLowerCase().endsWith("@pjprofessionals.nl")) {
    return NextResponse.json(
      { error: "Alleen @pjprofessionals.nl e-mailadressen zijn toegestaan." },
      { status: 400 }
    );
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const otp = String(crypto.randomInt(100000, 999999));
  const token = signOtpToken(normalizedEmail, otp);

  const transporter = nodemailer.createTransport({
    host: "mail-eu.smtp2go.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: "website@pjprofessionals.nl",
    to: normalizedEmail,
    subject: "Inlogcode — Handtekening generator",
    html: `
      <table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;color:#333;max-width:480px;">
        <tr><td style="padding:32px 0 16px;">
          <p style="margin:0 0 8px;font-size:15px;">Hallo,</p>
          <p style="margin:0 0 24px;font-size:15px;">Jouw inlogcode voor de handtekening generator:</p>
          <p style="margin:0 0 24px;font-size:36px;font-weight:bold;letter-spacing:10px;color:#1b1447;">${otp}</p>
          <p style="margin:0 0 8px;font-size:13px;color:#888;">De code is 10 minuten geldig.</p>
          <p style="margin:0;font-size:13px;color:#888;">Heb jij dit niet aangevraagd? Dan kun je deze e-mail negeren.</p>
        </td></tr>
        <tr><td style="padding-top:24px;border-top:1px solid #eee;font-size:12px;color:#aaa;">
          PJ Professionals
        </td></tr>
      </table>
    `,
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set("pj_otp", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 600,
    path: "/",
  });
  return response;
}
