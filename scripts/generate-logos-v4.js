#!/usr/bin/env node
// concept 5: identical layout to v1, all fonts → Cormorant Garamond
// Usage: node scripts/generate-logos-v4.js

const puppeteer = require("puppeteer-core");
const path = require("path");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT_DIR = path.join(__dirname, "../public/logo-concepts");

const PRIMARY = "#1D5C7A";
const ACCENT  = "#3FA7D6";

const concept = {
  name: "logo-concept-5-serif-authority",
  width: 720,
  height: 200,
  html: `
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300&display=swap" rel="stylesheet">
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body {
        background: transparent;
        width: 720px; height: 200px;
        display:flex; align-items:center; justify-content:center;
      }
      .wrap { display:flex; align-items:center; gap: 30px; }
      .pj {
        font-family: 'Cormorant Garamond', serif;
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
        font-family: 'Cormorant Garamond', serif;
        font-weight: 600;
        font-size: 28px;
        letter-spacing: 7px;
        text-transform: uppercase;
        color: ${PRIMARY};
      }
      .sub {
        font-family: 'Cormorant Garamond', serif;
        font-weight: 300;
        font-style: italic;
        font-size: 13px;
        letter-spacing: 3px;
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
};

async function generate() {
  console.log("Launching Chrome…");
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: concept.width, height: concept.height, deviceScaleFactor: 2 });

  const fullHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  html, body { margin:0; padding:0; background:transparent !important;
    width:${concept.width}px; height:${concept.height}px; overflow:hidden; }
</style></head>
<body>${concept.html}</body></html>`;

  await page.setContent(fullHtml, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 900));

  const outPath = path.join(OUT_DIR, `${concept.name}.png`);
  await page.screenshot({ path: outPath, omitBackground: true,
    clip: { x: 0, y: 0, width: concept.width, height: concept.height } });

  console.log(`✓ ${concept.name}.png`);
  await page.close();
  await browser.close();
  console.log("Done.");
}

generate().catch((err) => { console.error(err); process.exit(1); });
