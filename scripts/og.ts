// Builds the link-preview images from the /og/<card>/ pages.
// Usage: bun run og [card ...]   (needs `bun run dev` running on port 4321)
// e.g. `bun run og kelas` renders only public/og-kelas.png.
import { chromium } from "@playwright/test";

const BASE = process.env.OG_BASE ?? "http://localhost:4321";
const OUT = new URL("../public/", import.meta.url).pathname;
const CARDS = ["id", "en", ...["website", "kasir", "pembukuan"].flatMap((lane) => [`${lane}-id`, `${lane}-en`]), "kelas"];
const only = process.argv.slice(2);
const unknown = only.filter((card) => !CARDS.includes(card));
if (unknown.length) throw new Error(`Unknown card(s): ${unknown.join(", ")}. Known: ${CARDS.join(", ")}`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const card of only.length ? only : CARDS) {
  await page.goto(`${BASE}/og/${card}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${OUT}og-${card}.png` });
  console.log(`saved public/og-${card}.png`);
}
await browser.close();
