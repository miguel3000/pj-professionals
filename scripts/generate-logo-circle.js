#!/usr/bin/env node
// Recreates the client's circle logo with Cormorant Garamond + transparent bg
// Saves to public/logo.png (used on the homepage hero)

const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = path.join(__dirname, "../public/logo.png");
const BACKUP = path.join(__dirname, "../public/logo-backup.png");

const PRIMARY = "#1D5C7A";

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap" rel="stylesheet">
<style>
  html, body { margin:0; padding:0; background:transparent !important;
    width:500px; height:500px; overflow:hidden; }
</style>
</head>
<body>
<svg id="logo" width="500" height="500" viewBox="0 0 500 500"
     xmlns="http://www.w3.org/2000/svg">

  <!-- Circle arcs — drawn by JS below -->
  <path id="arc-top"    fill="none" stroke="${PRIMARY}" stroke-width="1.8" stroke-linecap="round"/>
  <path id="arc-right"  fill="none" stroke="${PRIMARY}" stroke-width="1.8" stroke-linecap="round"/>
  <path id="arc-bottom" fill="none" stroke="${PRIMARY}" stroke-width="1.8" stroke-linecap="round"/>
  <path id="arc-left"   fill="none" stroke="${PRIMARY}" stroke-width="1.8" stroke-linecap="round"/>

  <!-- PJ -->
  <text id="pj"
        x="250" y="268"
        text-anchor="middle"
        font-family="'Cormorant Garamond', serif"
        font-weight="700"
        font-size="120"
        fill="${PRIMARY}"
        letter-spacing="-1">PJ</text>

  <!-- PROFESSIONALS -->
  <text id="prof"
        x="250" y="444"
        text-anchor="middle"
        font-family="'Cormorant Garamond', serif"
        font-weight="600"
        font-size="15"
        fill="${PRIMARY}"
        letter-spacing="5">PROFESSIONALS</text>
</svg>

<script>
  // Helpers
  function pt(cx, cy, r, deg) {
    const rad = deg * Math.PI / 180;
    return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)];
  }
  // Simple arc from a1 -> a2 clockwise (a2 > a1, span < 180)
  function arc(cx, cy, r, a1, a2) {
    const [x1,y1] = pt(cx,cy,r,a1);
    const [x2,y2] = pt(cx,cy,r,a2);
    const span = ((a2-a1)+360)%360;
    const la = span > 180 ? 1 : 0;
    return \`M\${x1.toFixed(2)} \${y1.toFixed(2)} A\${r} \${r} 0 \${la} 1 \${x2.toFixed(2)} \${y2.toFixed(2)}\`;
  }
  // Arc wrapping through 0° (top): split at 0
  function topArc(cx, cy, r, a1, a2) {
    const [x1,y1] = pt(cx,cy,r,a1);
    const [xm,ym] = pt(cx,cy,r,0);
    const [x2,y2] = pt(cx,cy,r,a2);
    return \`M\${x1.toFixed(2)} \${y1.toFixed(2)} A\${r} \${r} 0 0 1 \${xm.toFixed(2)} \${ym.toFixed(2)} A\${r} \${r} 0 0 1 \${x2.toFixed(2)} \${y2.toFixed(2)}\`;
  }

  const cx = 250, cy = 215, r = 162;
  const gap = 10; // degrees each side of diagonal notch

  // Gaps at 45°, 135°, 225°, 315° — arcs connect the cardinals
  document.getElementById('arc-top')
    .setAttribute('d', topArc(cx, cy, r, 315+gap, 45-gap));   // 325° → 35°
  document.getElementById('arc-right')
    .setAttribute('d', arc(cx, cy, r, 45+gap, 135-gap));      // 55° → 125°
  document.getElementById('arc-bottom')
    .setAttribute('d', arc(cx, cy, r, 135+gap, 225-gap));     // 145° → 215°
  document.getElementById('arc-left')
    .setAttribute('d', arc(cx, cy, r, 225+gap, 315-gap));     // 235° → 305°
</script>
</body>
</html>`;

async function generate() {
  // Back up existing logo
  if (fs.existsSync(OUT)) {
    fs.copyFileSync(OUT, BACKUP);
    console.log("Backed up existing logo → public/logo-backup.png");
  }

  console.log("Launching Chrome…");
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 500, height: 500, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 900));

  await page.screenshot({
    path: OUT,
    omitBackground: true,
    clip: { x: 0, y: 0, width: 500, height: 500 },
  });

  await page.close();
  await browser.close();
  console.log("✓ public/logo.png saved");
}

generate().catch((err) => { console.error(err); process.exit(1); });
