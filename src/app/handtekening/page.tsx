import { cookies } from "next/headers";
import { readFileSync } from "fs";
import { join } from "path";
import { verifySession } from "@/lib/auth";
import HandtekeningClient from "./HandtekeningClient";

export const metadata = {
  title: "Handtekening generator — PJ Professionals",
  robots: { index: false, follow: false },
};

export default async function HandtekeningPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("pj_session")?.value;
  const session = sessionToken ? verifySession(sessionToken) : null;

  const logoPath = join(process.cwd(), "public", "logo-pj-dark.png");
  const logoB64 = readFileSync(logoPath).toString("base64");

  return (
    <HandtekeningClient
      authenticated={!!session}
      email={session?.email ?? ""}
      logoB64={logoB64}
    />
  );
}
