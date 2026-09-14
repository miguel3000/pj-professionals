import { cookies } from "next/headers";
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

  // Local-dev-only bypass so the generator can be tested without a real
  // @pjprofessionals.nl inbox to receive the login code. Never active in
  // production — the live site's login is untouched.
  const isDevBypass = process.env.NODE_ENV === "development" && !session;

  return (
    <HandtekeningClient
      authenticated={!!session || isDevBypass}
      email={session?.email ?? (isDevBypass ? "test.gebruiker@pjprofessionals.nl" : "")}
    />
  );
}
