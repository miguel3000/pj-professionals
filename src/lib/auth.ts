import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET ?? "dev-secret-change-in-production";

function sign(payload: object): string {
  const b64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(b64).digest("base64url");
  return `${b64}.${sig}`;
}

function verify<T>(token: string): T | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const b64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto.createHmac("sha256", SECRET).update(b64).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  try {
    return JSON.parse(Buffer.from(b64, "base64url").toString()) as T;
  } catch {
    return null;
  }
}

export function signOtpToken(email: string, otp: string): string {
  return sign({ email, otp, exp: Date.now() + 10 * 60 * 1000 });
}

export function verifyOtpToken(token: string): { email: string; otp: string } | null {
  const payload = verify<{ email: string; otp: string; exp: number }>(token);
  if (!payload || payload.exp < Date.now()) return null;
  return { email: payload.email, otp: payload.otp };
}

export function signSession(email: string): string {
  return sign({ email, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 });
}

export function verifySession(token: string): { email: string } | null {
  const payload = verify<{ email: string; exp: number }>(token);
  if (!payload || payload.exp < Date.now()) return null;
  return { email: payload.email };
}
