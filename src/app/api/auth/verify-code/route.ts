import { NextRequest, NextResponse } from "next/server";
import { verifyOtpToken, signSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  const otpToken = request.cookies.get("pj_otp")?.value;
  if (!otpToken) {
    return NextResponse.json(
      { error: "Sessie verlopen. Vraag een nieuwe code aan." },
      { status: 400 }
    );
  }

  const payload = verifyOtpToken(otpToken);
  if (!payload) {
    return NextResponse.json(
      { error: "Code verlopen. Vraag een nieuwe code aan." },
      { status: 400 }
    );
  }

  if (payload.otp !== String(code).trim()) {
    return NextResponse.json({ error: "Onjuiste code. Probeer opnieuw." }, { status: 400 });
  }

  const sessionToken = signSession(payload.email);

  const response = NextResponse.json({ success: true });
  response.cookies.set("pj_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
  response.cookies.delete("pj_otp");
  return response;
}
