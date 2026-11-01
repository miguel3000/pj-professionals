export type SiteDocument = {
  title: string;
  description: string;
  href: string;
  filename: string;
  size: string;
};

const dir = "/documenten";

export const privacyverklaring: SiteDocument = {
  title: "Privacyverklaring PJ Professionals",
  description: "Hoe wij omgaan met uw persoonsgegevens, op welke grondslag en welke rechten u heeft.",
  href: `${dir}/Privacyverklaring-PJ-Professionals.pdf`,
  filename: "Privacyverklaring PJ Professionals.pdf",
  size: "PDF · 366 KB",
};

export const klachtenreglement: SiteDocument = {
  title: "Klachtenreglement PJ Professionals",
  description: "Hoe u een klacht kunt indienen en hoe wij die behandelen.",
  href: `${dir}/Klachtenreglement-PJ-Professionals.pdf`,
  filename: "Klachtenreglement PJ Professionals.pdf",
  size: "PDF · 405 KB",
};

export const clienttevredenheid: SiteDocument = {
  title: "Cliënttevredenheidsonderzoek 2025",
  description: "De resultaten van ons jaarlijkse cliënttevredenheidsonderzoek.",
  href: `${dir}/Clienttevredenheidsonderzoek-2025.pdf`,
  filename: "Clienttevredenheidsonderzoek 2025.pdf",
  size: "PDF · 594 KB",
};

const verslag = (year: number, size: string): SiteDocument => ({
  title: `Kwaliteitsjaarverslag Forensische Zorg ${year}`,
  description: `Kwaliteitsjaarverslag over de forensische zorg van PJ Professionals in ${year}.`,
  href: `${dir}/Kwaliteitsjaarverslag-Forensische-Zorg-${year}.pdf`,
  filename: `Kwaliteitsjaarverslag Forensische Zorg ${year} PJ Professionals.pdf`,
  size: `PDF · ${size}`,
});

/** Newest first. */
export const kwaliteitsverslagen: SiteDocument[] = [
  verslag(2025, "422 KB"),
  verslag(2024, "468 KB"),
  verslag(2023, "398 KB"),
  verslag(2022, "235 KB"),
];
