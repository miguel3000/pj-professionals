#!/usr/bin/env node
// Generates 5 transparent-background logo concept PNGs for PJ Professionals
// Usage: node scripts/generate-logos.js

const puppeteer = require("puppeteer-core");
const path = require("path");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT_DIR = path.join(__dirname, "../public/logo-concepts");

const PRIMARY = "#1D5C7A";
const ACCENT = "#3FA7D6";
const LIGHT = "#a6cadd";

// Each concept is a self-contained HTML string (body only, no <html>/<head>)
// The page background will be transparent; only the SVG/element is rendered.
const concepts = [
  // ─────────────────────────────────────────
  // 1. Minimal Split Wordmark
  //    Jost | clean horizontal rule divides "PJ" from "professionals"
  // ─────────────────────────────────────────
  {
    name: "logo-concept-1-split-wordmark",
    width: 720,
    height: 200,
    html: `
      <link href="https://fonts.googleapis.com/css2?family=Jost:wght@700;400&display=swap" rel="stylesheet">
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background: transparent; width: 720px; height: 200px; display:flex; align-items:center; justify-content:center; }
        .wrap { display:flex; align-items:center; gap: 28px; }
        .pj {
          font-family: 'Jost', sans-serif;
          font-weight: 700;
          font-size: 96px;
          color: ${PRIMARY};
          letter-spacing: -2px;
          line-height: 1;
        }
        .rule {
          width: 2px;
          height: 80px;
          background: ${ACCENT};
          border-radius: 2px;
          flex-shrink: 0;
        }
        .right { display:flex; flex-direction:column; gap:6px; }
        .professionals {
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          font-size: 22px;
          letter-spacing: 6px;
          text-transform: uppercase;
          color: ${PRIMARY};
        }
        .tagline {
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: ${ACCENT};
        }
      </style>
      <div class="wrap">
        <div class="pj">PJ</div>
        <div class="rule"></div>
        <div class="right">
          <div class="professionals">Professionals</div>
          <div class="tagline">Begeleiding &amp; Behandeling</div>
        </div>
      </div>`,
  },

  // ─────────────────────────────────────────
  // 2. Flowing Curve — SVG arc connects "PJ" to "professionals"
  //    Montserrat ExtraBold for PJ, medium for tagline
  // ─────────────────────────────────────────
  {
    name: "logo-concept-2-flowing-curve",
    width: 720,
    height: 200,
    html: `
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800;400&display=swap" rel="stylesheet">
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background: transparent; width: 720px; height: 200px; display:flex; align-items:center; justify-content:center; }
      </style>
      <svg width="720" height="200" viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;400&amp;display=swap');
          </style>
        </defs>
        <!-- Large PJ -->
        <text x="60" y="148" font-family="'Montserrat', sans-serif" font-weight="800"
              font-size="120" fill="${PRIMARY}" letter-spacing="-4">PJ</text>

        <!-- Accent curve flowing right from J -->
        <path d="M 246 80 Q 310 40 370 80" stroke="${ACCENT}" stroke-width="3.5"
              fill="none" stroke-linecap="round"/>

        <!-- Small circle dot at end of curve -->
        <circle cx="370" cy="80" r="5" fill="${ACCENT}"/>

        <!-- "professionals" text to the right -->
        <text x="384" y="100" font-family="'Montserrat', sans-serif" font-weight="800"
              font-size="36" fill="${PRIMARY}">professionals</text>

        <!-- Fine underline -->
        <line x1="384" y1="110" x2="680" y2="110" stroke="${ACCENT}" stroke-width="1.5"/>

        <!-- Tagline -->
        <text x="384" y="132" font-family="'Montserrat', sans-serif" font-weight="400"
              font-size="13" fill="${ACCENT}" letter-spacing="2">WMO · FORENSISCHE ZORG</text>
      </svg>`,
  },

  // ─────────────────────────────────────────
  // 3. Humanist Stacked
  //    Nunito ExtraBold "PJ" stacked over a thin arc, "professionals" below
  // ─────────────────────────────────────────
  {
    name: "logo-concept-3-stacked-arc",
    width: 520,
    height: 260,
    html: `
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@800;600&display=swap" rel="stylesheet">
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background: transparent; width: 520px; height: 260px; display:flex; align-items:center; justify-content:center; }
      </style>
      <svg width="520" height="260" viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg">
        <!-- "PJ" centered -->
        <text x="260" y="150" text-anchor="middle"
              font-family="'Nunito', sans-serif" font-weight="800"
              font-size="130" fill="${PRIMARY}" letter-spacing="-4">PJ</text>

        <!-- Accent arc under PJ -->
        <path d="M 100 162 Q 260 195 420 162" stroke="${ACCENT}" stroke-width="3"
              fill="none" stroke-linecap="round"/>

        <!-- "professionals" below arc -->
        <text x="260" y="206" text-anchor="middle"
              font-family="'Nunito', sans-serif" font-weight="600"
              font-size="22" fill="${ACCENT}" letter-spacing="5">PROFESSIONALS</text>
      </svg>`,
  },

  // ─────────────────────────────────────────
  // 4. Geometric Badge + Wordmark
  //    Circle badge with "PJ" + stacked wordmark right
  // ─────────────────────────────────────────
  {
    name: "logo-concept-4-badge-wordmark",
    width: 700,
    height: 200,
    html: `
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@700;400&display=swap" rel="stylesheet">
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background: transparent; width: 700px; height: 200px; display:flex; align-items:center; justify-content:center; }
      </style>
      <svg width="700" height="200" viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
        <!-- Outer ring -->
        <circle cx="100" cy="100" r="86" fill="none" stroke="${PRIMARY}" stroke-width="3"/>
        <!-- Accent inner ring -->
        <circle cx="100" cy="100" r="74" fill="none" stroke="${ACCENT}" stroke-width="1.5" stroke-dasharray="5 4"/>
        <!-- PJ in circle -->
        <text x="100" y="122" text-anchor="middle"
              font-family="'DM Sans', sans-serif" font-weight="700"
              font-size="68" fill="${PRIMARY}" letter-spacing="-2">PJ</text>

        <!-- Vertical divider -->
        <line x1="210" y1="48" x2="210" y2="152" stroke="${PRIMARY}" stroke-width="1.5" opacity="0.4"/>

        <!-- Wordmark right side -->
        <text x="234" y="89" font-family="'DM Sans', sans-serif" font-weight="700"
              font-size="44" fill="${PRIMARY}">PJ</text>
        <text x="234" y="134" font-family="'DM Sans', sans-serif" font-weight="400"
              font-size="28" fill="${PRIMARY}" letter-spacing="2">Professionals</text>
        <!-- Accent line under tagline -->
        <line x1="234" y1="145" x2="630" y2="145" stroke="${ACCENT}" stroke-width="2"/>
        <text x="234" y="162" font-family="'DM Sans', sans-serif" font-weight="400"
              font-size="11" fill="${ACCENT}" letter-spacing="3">ZORG IN NOORDOOST-BRABANT</text>
      </svg>`,
  },

  // ─────────────────────────────────────────
  // 5. Serif Authority
  //    Playfair Display "PJ" + thin vertical bar + DM Sans "PROFESSIONALS"
  // ─────────────────────────────────────────
  {
    name: "logo-concept-5-serif-authority",
    width: 720,
    height: 200,
    html: `
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;600&display=swap" rel="stylesheet">
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background: transparent; width: 720px; height: 200px; display:flex; align-items:center; justify-content:center; }
        .wrap { display:flex; align-items:center; gap: 30px; }
        .pj {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 100px;
          color: ${PRIMARY};
          line-height: 1;
          letter-spacing: -1px;
        }
        .divider {
          width: 1.5px;
          height: 100px;
          background: linear-gradient(to bottom, transparent, ${ACCENT}, transparent);
          flex-shrink: 0;
        }
        .right { display:flex; flex-direction:column; justify-content:center; gap: 4px; }
        .main {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 28px;
          letter-spacing: 7px;
          text-transform: uppercase;
          color: ${PRIMARY};
        }
        .sub {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 12px;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: ${ACCENT};
        }
      </style>
      <div class="wrap">
        <div class="pj">PJ</div>
        <div class="divider"></div>
        <div class="right">
          <div class="main">Professionals</div>
          <div class="sub">WMO &amp; Forensische Zorg</div>
        </div>
      </div>`,
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

    // 2× retina scale for crisp output
    await page.setViewport({
      width: concept.width,
      height: concept.height,
      deviceScaleFactor: 2,
    });

    // Wrap HTML in minimal shell with transparent bg
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
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

    // Extra wait for Google Fonts to render
    await new Promise((r) => setTimeout(r, 800));

    const outPath = path.join(OUT_DIR, `${concept.name}.png`);
    await page.screenshot({
      path: outPath,
      omitBackground: true, // transparent PNG
      clip: { x: 0, y: 0, width: concept.width, height: concept.height },
    });

    console.log(`✓ ${concept.name}.png`);
    await page.close();
  }

  await browser.close();
  console.log("\nAll 5 logos saved to public/logo-concepts/");
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
