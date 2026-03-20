import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "PJ Professionals - Wij blijven staan waar anderen afhaken",
  description:
    "PJ Professionals biedt begeleiding en behandeling van volwassenen binnen de WMO en forensische zorg in de regio Den Bosch en Oss.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
