/**
 * Active vacancies, defined once. Read by the Vacatures page (cards with the full text),
 * the contact form (the "Waarop reageert u?" dropdown) and /api/contact (validates the choice).
 * Plain data only, so it can be imported from client and server code alike.
 *
 * Text comes from the client's vacancy documents (Nov 2026). Rules for edits: no em dashes,
 * no facts that are not in the source documents.
 */

/** A paragraph (string) or a bullet list (string[]). */
export type VacancyBlock = string | string[];

export type VacancySection = {
  heading?: string;
  blocks: VacancyBlock[];
};

export type Vacancy = {
  /** Used in the URL (?vacature=...), as card anchor and as dropdown value. Never change a live slug. */
  slug: string;
  title: string;
  subtitle?: string;
  intro: string[];
  sections: VacancySection[];
  /** Named people to call, shown at the end of the text. */
  contact?: { intro: string; people: { name: string; phone: string }[] };
};

export const VACANCY_LOCATION = "PJ Professionals, regio 's-Hertogenbosch / Oss";

export const vacatures: Vacancy[] = [
  {
    slug: "ambulant-begeleider",
    title: "Ambulant begeleider",
    intro: [
      "Zoek jij een baan waar je écht het verschil maakt én deel wordt van een klein, hecht team waar iedereen elkaar kent?",
      "Bij PJ Professionals werk je in een warme, betrokken organisatie met korte lijnen, veel vrijheid en echte saamhorigheid. Hier ben je geen nummer, maar een allround professional die dagelijks waardevol werk doet, én werkt in flexibele werktijden die bijdragen aan een gezonde balans tussen werk en privé.",
    ],
    sections: [
      {
        heading: "Wat je doet",
        blocks: [
          "Als Ambulant Begeleider ondersteun je volwassenen (18+) met psychische problemen, LVB, verslaving of complexe vraagstukken op meerdere leefgebieden. Je helpt hen stap voor stap richting stabiliteit, zelfredzaamheid en toekomstperspectief.",
          "Geen dag is hetzelfde: je werkt zelfstandig, outreachend en altijd vanuit vertrouwen. Je schakelt snel, maakt gemakkelijk verbinding en weet cliënten te motiveren én te begrenzen. Je werkt in kleine specialistische teams waarin iedereen elkaar ondersteunt en waar saamhorigheid vanzelfsprekend is.",
        ],
      },
      {
        heading: "Over PJ Professionals",
        blocks: [
          "PJ Professionals biedt begeleiding aan volwassenen met zowel enkelvoudige als complexe hulpvragen, waaronder psychiatrische problematiek, LVB, verslavingsproblematiek en forensische zorg. Wij blijven staan waar anderen afhaken. Door snel te schakelen, dichtbij te blijven en maatwerk te bieden, creëren we duurzame vooruitgang voor onze cliënten.",
        ],
      },
      {
        heading: "Wat jij meebrengt",
        blocks: [
          [
            "Een afgeronde mbo-4 of hbo-opleiding binnen zorg & welzijn.",
            "Rijbewijs B + eigen vervoer.",
            "Stevigheid, flexibiliteit en communicatieve kracht.",
            "Vermogen om helder te begrenzen en toch nabij te blijven.",
            "Zelfstandig kunnen werken binnen een klein team.",
            "Een VOG (wordt opgevraagd).",
          ],
        ],
      },
      {
        heading: "Waarom werken bij ons?",
        blocks: [
          [
            "Klein & betrokken team: iedereen kent elkaar en staat voor elkaar klaar.",
            "Korte lijnen: jouw ideeën maken direct verschil.",
            "Kleine specialistische teams: veel onderlinge steun en kennisdeling.",
            "Flexibele werktijden: gezonde balans tussen werk en privé.",
            "Allround & afwisselend werk: geen dag is hetzelfde.",
            "Je werkt met cliënten die écht baat hebben bij jouw inzet en nabijheid.",
            "Ruimte voor groei: professionele ontwikkeling en scholing.",
            "Arbeidsvoorwaarden volgens de GGZ CAO, 24 tot 36 uur, tijdelijk met uitzicht op vast.",
          ],
        ],
      },
      {
        heading: "Word jij onze nieuwe collega?",
        blocks: [],
      },
    ],
    contact: {
      intro: "Vragen?",
      people: [
        { name: "Frank Versluis", phone: "06 83614695" },
        { name: "Aniëlka Jacobs", phone: "06 12753094" },
      ],
    },
  },
  {
    slug: "ervaringsdeskundige",
    title: "HBO Ervaringsdeskundige",
    subtitle: "Ambulante (forensische) begeleiding",
    intro: [
      "PJ Professionals zoekt een ervaringsdeskundige die eigen herstel- en levenservaring professioneel kan inzetten binnen onze ambulante begeleiding. Je bent volwaardig onderdeel van het team en werkt in een hybride rol: je bent binnen het buddy-/shared-caseloadmodel betrokken bij cliënten én wordt gericht ingezet bij andere cliënten wanneer jouw ervaringsdeskundigheid meerwaarde heeft.",
    ],
    sections: [
      {
        heading: "Wat ga je doen?",
        blocks: [
          [
            "Je begeleidt cliënten methodisch en herstelgericht binnen de afspraken van PJ Professionals.",
            "Je voert herstelgesprekken en ondersteunt cliënten bij motivatie, vertrouwen, eigen regie en perspectief.",
            "Je zet je eigen ervaring bewust en begrensd in; het belang en hersteldoel van de cliënt staan centraal.",
            "Je kunt aanvullend worden ingezet bij zorgmijding, het aangaan van begeleiding, schaamte, uitsluiting of maatschappelijke terugkeer.",
            "Je signaleert risico's en veranderingen en stemt hierover tijdig af met collega's.",
            "Je neemt deel aan teamoverleg, intervisie, werkbegeleiding en inhoudelijke coaching.",
          ],
        ],
      },
      {
        heading: "Functie-eisen",
        blocks: [
          [
            "Je hebt een voor deze functie passend afgerond diploma op minimaal hbo-niveau.",
            "Je hebt een passende opleiding of scholing in ervaringsdeskundigheid afgerond.",
            "Je hebt relevante eigen herstel- en levenservaring en kunt deze professioneel, methodisch en begrensd inzetten.",
            "Je hebt voldoende afstand tot je eigen problematiek en bent voldoende belastbaar om ambulant en zelfstandig te werken.",
            "Je kunt zelfstandig op pad en binnen professionele kaders verantwoordelijkheid dragen.",
            "Je kunt een voor de functie passende VOG overleggen.",
            "Je bent geen huidige of voormalige cliënt van PJ Professionals.",
          ],
        ],
      },
      {
        heading: "Wat verwachten we daarnaast?",
        blocks: [
          [
            "Je werkt herstelgericht, gelijkwaardig en zonder oordeel.",
            "Je kunt goed reflecteren op je eigen handelen en grenzen.",
            "Je werkt zelfstandig, maar zoekt actief samenwerking en afstemming.",
            "Je kunt functioneren binnen een complexe en waar van toepassing forensische context.",
          ],
        ],
      },
      {
        heading: "Over PJ Professionals",
        blocks: [
          "PJ Professionals biedt ambulante begeleiding en forensische begeleiding en behandeling. Ervaringsdeskundigheid zien wij als professionele expertise: niet als het delen van een persoonlijk verhaal op zichzelf, maar als het methodisch inzetten van doorleefde ervaring ten behoeve van herstel, aansluiting en perspectief van cliënten.",
        ],
      },
      {
        heading: "Interesse?",
        blocks: [
          "Solliciteer via de knop hieronder met je cv en een korte motivatie waarin je beschrijft hoe je jouw ervaringskennis professioneel inzet en hoe je omgaat met grenzen, samenwerking en zelfstandig ambulant werken.",
        ],
      },
    ],
  },
  {
    slug: "regiebehandelaar",
    title: "Regiebehandelaar GZ-psycholoog / Verpleegkundig specialist GGZ / Psychotherapeut",
    intro: [
      "PJ Professionals is op zoek naar een regiebehandelaar die een cruciale rol speelt in de behandeling en diagnostiek van forensische cliënten. Als regiebehandelaar begeleid je het behandelproces en zorg je voor een integrale aanpak. Wil jij een verschil maken in het persoonlijk, sociaal en maatschappelijk herstel van deze cliënten? Sluit je aan bij ons Forensisch Team en solliciteer nu!",
    ],
    sections: [
      {
        heading: "Over PJ Professionals",
        blocks: [
          "PJ Professionals behandelt forensische cliënten met uiteenlopende psychiatrische- en of verslavingsproblematiek, vaak gecombineerd met problemen op verschillende leefgebieden. Met een actieve, outreachende aanpak richt PJ zich op zelfredzaamheid, voorkomen van recidive en risicobeheersing. Behandeling vindt zowel ambulant als poliklinisch plaats, waarbij samenwerking met de cliënt en zijn netwerk centraal staat voor een integraal plan van aanpak.",
        ],
      },
      {
        heading: "Over de rol",
        blocks: [
          "Bij PJ Professionals krijg je als GZ-psycholoog, Verpleegkundig Specialist GGZ of Psychotherapeut de kans om volwassenen (18+) met uiteenlopende psychische problemen te behandelen. Je voert diagnostiek uit die aansluit bij de vraag vanuit de reclassering, variërend van brede onderzoeken naar bijvoorbeeld persoonlijkheid en psychiatrische stoornissen, tot specialistisch onderzoek zoals bij ADHD en autisme. De behandelingen zijn gebaseerd op het Risk-Need-Responsivity-model, waarbij de nadruk ligt op het voorkomen van recidive en het versterken van beschermende factoren om cliënten een stabielere toekomst te bieden.",
        ],
      },
      {
        heading: "Wat ga je doen?",
        blocks: [
          [
            "Regie voeren over de behandelingen",
            "Het behandelen van forensische cliënten met een combinatie van psychische klachten en/of verslavingsproblematiek.",
            "Intakes bij forensische cliënten en indien nodig diagnostiek",
            "Deel uitmaken van het Forensische Team, nauwe samenwerking met de begeleiders/behandelaren.",
            "Samenwerking met externe partners (zoals reclassering)",
            "Deelname aan casuïstiekoverleg en meedenken in de doorontwikkeling van de kwaliteit van de zorg",
          ],
          "Deze functie is dynamisch en geen dag is hetzelfde. Dankzij de diversiteit aan hulpvragen blijft jouw werk uitdagend en afwisselend.",
        ],
      },
      {
        heading: "Wat vragen wij van jou?",
        blocks: [
          [
            "Je hebt je rijbewijs B én eigen vervoer",
            "Je hebt een afgeronde opleiding tot GZ-psycholoog, verpleegkundig specialist GGZ of psychotherapeut. BIG geregistreerd",
            "Relevante werkervaring of affiniteit met forensische cliënten met complexe meervoudige problematiek",
            "Er zal een VOG worden opgevraagd",
            "In staat zijn om zowel zelfstandig als effectief binnen een team samen te werken",
            "Nauwkeurigheid in het registreren in het EPD en het beheren van de agenda",
            "Positieve, motiverende houding, doorzetten waar andere stoppen",
            "Kunnen motiveren maar ook begrenzen",
          ],
        ],
      },
      {
        heading: "Waarom werken bij ons?",
        blocks: [
          "We zijn een organisatie met korte lijnen, waar je wordt gestimuleerd om met vernieuwende ideeën te komen en creatief te denken. Je werkt zelfstandig, maar blijft altijd onderdeel van een klein, betrokken team dat elkaar steunt. Jouw werkplezier is belangrijk voor ons! Daarom zorgen we niet alleen goed voor onze cliënten, maar ook voor jou.",
          [
            "Salaris is afhankelijk van je achtergrond, volgens de CAO GGZ",
            "Een tijdelijk arbeidscontract met uitzicht op een vast contract",
            "De omvang van het dienstverband is flexibel en kan in overleg worden vastgesteld, van 16 tot 36 uur per week",
            "Verbinding en teamwork: een klein hecht team dat voor elkaar klaarstaat",
            "Een betekenisvolle rol: dagelijks het verschil maken in het leven van anderen",
            "Ruimte voor persoonlijke ontwikkeling: een omgeving die jou stimuleert om te blijven groeien",
          ],
        ],
      },
      {
        blocks: [
          "Ben jij enthousiast om samen met ons bij te dragen aan een zelfredzamer leven voor onze cliënten? Reageer dan snel en wie weet word jij onze nieuwe collega!",
        ],
      },
    ],
    contact: {
      intro: "Voor vragen kun je contact opnemen met de directie:",
      people: [
        { name: "Jeroen Buuts", phone: "06 55937942" },
        { name: "Paul Spijker", phone: "06 19959845" },
      ],
    },
  },
];

/** What a sollicitatie can be about: the vacancies above, an open application, or an internship. */
export type ApplicationChoice = {
  value: string;
  label: string;
  group: "vacature" | "overig";
};

export const applicationChoices: ApplicationChoice[] = [
  ...vacatures.map((v) => ({ value: v.slug, label: v.title, group: "vacature" as const })),
  { value: "open", label: "Open sollicitatie", group: "overig" },
  { value: "stage", label: "Stage / stageverzoek", group: "overig" },
];

export function findChoice(value: unknown): ApplicationChoice | undefined {
  return typeof value === "string" ? applicationChoices.find((c) => c.value === value) : undefined;
}

/** Link to the contact form with the sollicitatie reason and this choice preselected. */
export function applyHref(value: string): string {
  return `/contact?reden=sollicitatie&vacature=${encodeURIComponent(value)}#contactformulier`;
}

/** "06 83614695" -> "tel:0683614695" */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
