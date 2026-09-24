// Builds the link-preview images from the /og/<lang>/ pages.
// Usage: bun run og   (needs `bun run dev` running on port 4321)
import { chromium } from "@playwright/test";

const BASE = process.env.OG_BASE ?? "http://localhost:4321";
const OUT = new URL("../public/", import.meta.url).pathname;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const lang of ["id", "en"]) {
  await page.goto(`${BASE}/og/${lang}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${OUT}og-${lang}.png` });
  console.log(`saved public/og-${lang}.png`);
}
await browser.close();
