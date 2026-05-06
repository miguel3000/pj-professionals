#!/usr/bin/env node
// Generates refined concept 4 & 5 logo PNGs for PJ Professionals
// Usage: node scripts/generate-logos-v2.js

const puppeteer = require("puppeteer-core");
const path = require("path");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT_DIR = path.join(__dirname, "../public/logo-concepts");

const PRIMARY = "#1D5C7A";
const ACCENT = "#3FA7D6";

const concepts = [
  // ─────────────────────────────────────────
  // 4 (revised) — Solid Badge + Wordmark
  //   Outfit throughout. Filled solid teal circle badge with white PJ.
  //   Clean wordmark right side. Accent bar + colored tagline.
  //   PJ appears only once (in the badge), no redundancy.
  // ─────────────────────────────────────────
  {
    name: "logo-concept-4-badge-wordmark-v2",
    width: 680,
    height: 180,
    html: `
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;700;800&display=swap" rel="stylesheet">
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background: transparent; width:680px; height:180px; display:flex; align-items:center; justify-content:center; }
      </style>
      <svg width="680" height="180" viewBox="0 0 680 180" xmlns="http://www.w3.org/2000/svg">
        <!-- Filled badge circle -->
        <circle cx="90" cy="90" r="80" fill="${PRIMARY}"/>

        <!-- Thin accent ring outside -->
        <circle cx="90" cy="90" r="80" fill="none" stroke="${ACCENT}" stroke-width="2.5" opacity="0.6"/>

        <!-- White PJ reversed out -->
        <text x="90" y="114" text-anchor="middle"
              font-family="'Outfit', sans-serif" font-weight="800"
              font-size="72" fill="white" letter-spacing="-2">PJ</text>

        <!-- Vertical divider — accent colored, subtle -->
        <line x1="192" y1="34" x2="192" y2="146" stroke="${ACCENT}" stroke-width="2"/>

        <!-- "Professionals" — same font, bold -->
        <text x="216" y="104" font-family="'Outfit', sans-serif" font-weight="700"
              font-size="42" fill="${PRIMARY}">Professionals</text>

        <!-- Accent underline bar -->
        <rect x="216" y="116" width="430" height="2.5" fill="${ACCENT}" rx="1.25"/>

        <!-- Tagline — light weight, spaced -->
        <text x="216" y="140" font-family="'Outfit', sans-serif" font-weight="300"
              font-size="13" fill="${ACCENT}" letter-spacing="3.5">WMO · FORENSISCHE ZORG · NOORDOOST-BRABANT</text>
      </svg>`,
  },

  // ─────────────────────────────────────────
  // 5 (revised) — Serif Authority + Swoosh
  //   Cormorant Garamond throughout (refined, elegant, professional).
  //   Decorative flourish-style arc over the "PJ" — suggests forward
  //   motion and care without being literal. Italic tagline.
  // ─────────────────────────────────────────
  {
    name: "logo-concept-5-serif-authority-v2",
    width: 740,
    height: 210,
    html: `
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background: transparent; width:740px; height:210px; display:flex; align-items:center; justify-content:center; }
      </style>
      <svg width="740" height="210" viewBox="0 0 740 210" xmlns="http://www.w3.org/2000/svg">
        <!-- Decorative swoosh arc above PJ — accent color, thin, confident -->
        <!-- Starts left of P, rises to a peak, descends and tapers to a fine point right of J -->
        <path d="M 52 88 C 68 44, 102 30, 130 40 C 158 50, 168 72, 178 80"
              stroke="${ACCENT}" stroke-width="2.2" fill="none"
              stroke-linecap="round"/>
        <!-- Tail dot at end of swoosh -->
        <circle cx="178" cy="80" r="3.5" fill="${ACCENT}"/>

        <!-- PJ — Cormorant Garamond bold -->
        <text x="52" y="158" font-family="'Cormorant Garamond', serif" font-weight="700"
              font-size="118" fill="${PRIMARY}" letter-spacing="-1">PJ</text>

        <!-- Gradient divider — fades in and out -->
        <defs>
          <linearGradient id="divGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${PRIMARY}" stop-opacity="0"/>
            <stop offset="30%" stop-color="${PRIMARY}" stop-opacity="0.6"/>
            <stop offset="70%" stop-color="${PRIMARY}" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="${PRIMARY}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <rect x="212" y="30" width="1.5" height="150" fill="url(#divGrad)"/>

        <!-- "PROFESSIONALS" — same Cormorant, semibold, spaced -->
        <text x="232" y="120" font-family="'Cormorant Garamond', serif" font-weight="600"
              font-size="38" fill="${PRIMARY}" letter-spacing="6">PROFESSIONALS</text>

        <!-- Italic tagline — same font, lighter -->
        <text x="234" y="152" font-family="'Cormorant Garamond', serif" font-weight="400"
              font-style="italic" font-size="18" fill="${ACCENT}" letter-spacing="1">
          WMO &amp; Forensische Zorg
        </text>
      </svg>`,
  },
];

async function generate() {
  console.log("Launching Chrome…");
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const concept of concepts) {
    const page = await browser.newPage();
    await page.setViewport({
      width: concept.width,
      height: concept.height,
      deviceScaleFactor: 2,
    });

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  html, body {
    margin: 0; padding: 0;
    background: transparent !important;
    width: ${concept.width}px;
    height: ${concept.height}px;
    overflow: hidden;
  }
</style>
</head>
<body>${concept.html}</body>
</html>`;

    await page.setContent(fullHtml, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 900));

    const outPath = path.join(OUT_DIR, `${concept.name}.png`);
    await page.screenshot({
      path: outPath,
      omitBackground: true,
      clip: { x: 0, y: 0, width: concept.width, height: concept.height },
    });

    console.log(`✓ ${concept.name}.png`);
    await page.close();
  }

  await browser.close();
  console.log("\nDone.");
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
