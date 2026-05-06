#!/usr/bin/env node
const puppeteer = require("puppeteer-core");
const path = require("path");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(__dirname, "../public/logo-concepts/hero-preview.jpg"),
    type: "jpeg",
    quality: 92,
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });
  await browser.close();
  console.log("✓ hero-preview.jpg saved");
}
run().catch(e => { console.error(e); process.exit(1); });
