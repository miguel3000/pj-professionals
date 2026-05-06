#!/usr/bin/env node
// Refines concept 5 only: original layout + single elegant font throughout
// Usage: node scripts/generate-logos-v3.js

const puppeteer = require("puppeteer-core");
const path = require("path");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT_DIR = path.join(__dirname, "../public/logo-concepts");

const PRIMARY = "#1D5C7A";
const ACCENT  = "#3FA7D6";

const concepts = [
  // ─────────────────────────────────────────
  // 5 (v3) — original layout, Cormorant Garamond throughout
  //   PJ | gradient divider | PROFESSIONALS + italic tagline
  //   No swoosh — clean, spacious, elegant
  // ─────────────────────────────────────────
  {
    name: "logo-concept-5-serif-authority-v3",
    width: 720,
    height: 200,
    html: `
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background: transparent; width:720px; height:200px; display:flex; align-items:center; justify-content:center; }
        .wrap { display:flex; align-items:center; gap: 30px; }
        .pj {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          font-size: 104px;
          color: ${PRIMARY};
          line-height: 1;
          letter-spacing: -1px;
        }
        .right {
          display:flex; flex-direction:column; justify-content:center; gap: 6px;
        }
        .main {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600;
          font-size: 30px;
          letter-spacing: 8px;
          text-transform: uppercase;
          color: ${PRIMARY};
        }
        .sub {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-style: italic;
          font-size: 16px;
          letter-spacing: 1px;
          color: ${ACCENT};
        }
      </style>
      <!-- gradient divider rendered in SVG so it fades nicely -->
      <svg width="720" height="200" viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="${PRIMARY}" stop-opacity="0"/>
            <stop offset="25%"  stop-color="${PRIMARY}" stop-opacity="0.55"/>
            <stop offset="75%"  stop-color="${PRIMARY}" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="${PRIMARY}" stop-opacity="0"/>
          </linearGradient>
        </defs>

        <!-- PJ -->
        <text x="52" y="155"
              font-family="'Cormorant Garamond', serif" font-weight="700"
              font-size="130" fill="${PRIMARY}" letter-spacing="-2">PJ</text>

        <!-- gradient divider -->
        <rect x="228" y="28" width="1.5" height="144" fill="url(#dg)"/>

        <!-- PROFESSIONALS -->
        <text x="252" y="115"
              font-family="'Cormorant Garamond', serif" font-weight="600"
              font-size="30" fill="${PRIMARY}" letter-spacing="8">PROFESSIONALS</text>

        <!-- italic tagline -->
        <text x="254" y="146"
              font-family="'Cormorant Garamond', serif" font-weight="400"
              font-style="italic" font-size="17" fill="${ACCENT}" letter-spacing="0.5">
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
