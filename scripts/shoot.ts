// Captures portfolio screenshots of public pages.
// Usage: bun scripts/shoot.ts [name ...]   (no args = all)
import { chromium } from "@playwright/test";

// `phone` captures at 390x844, 2x, saved as JPEG for the phone frames.
// `dismiss` is the text of a popup's close button.
type Shot = { name: string; url: string; wait?: number; scrollY?: number; phone?: boolean; dismiss?: string };

const SHOTS: Shot[] = [
  { name: "admos-accounting", url: "https://accounting.admos.id/" },
  { name: "admos-laris", url: "https://laris.admos.id/" },
  { name: "ringkasaja", url: "https://ringkasaja.com/" },
  { name: "ringkasaja-demo", url: "https://app.ringkasaja.com/demo" },
  { name: "ummu-alfatih", url: "https://ummualfatih.id/products" },
  { name: "ummu-alfatih-mobile", url: "https://ummualfatih.id/", phone: true, dismiss: "Tutup" },
  { name: "ummu-alfatih-produk-mobile", url: "https://ummualfatih.id/products/916417/nara-outer-stripe", phone: true },
  { name: "search-array", url: "https://search-array.com/" },
  { name: "katalis", url: "https://katalis.ai/" },
  { name: "wateriq", url: "https://wateriq.solarchapter.com/" },
  { name: "tokopedia-promo", url: "https://www.tokopedia.com/promo" },
];

const OUT_DIR = new URL("../src/assets/work/", import.meta.url).pathname;
const VIEWPORT = { width: 1440, height: 900 };

const wanted = new Set(process.argv.slice(2));
const shots = wanted.size ? SHOTS.filter((s) => wanted.has(s.name)) : SHOTS;

const browser = await chromium.launch();
const desktop = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 1,
  locale: "id-ID",
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
});
const phone = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: "id-ID",
  userAgent:
    "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
});

for (const shot of shots) {
  const page = await (shot.phone ? phone : desktop).newPage();
  try {
    await page.goto(shot.url, { waitUntil: "networkidle", timeout: 45_000 });
  } catch (err) {
    console.warn(`${shot.name}: networkidle timeout, capturing anyway (${(err as Error).message.split("\n")[0]})`);
  }
  await page.waitForTimeout(shot.wait ?? 2500);
  if (shot.dismiss) {
    await page.getByText(shot.dismiss, { exact: true }).click({ timeout: 5_000 }).catch(() => console.warn(`${shot.name}: no "${shot.dismiss}" popup`));
    await page.waitForTimeout(800);
  }
  if (shot.scrollY) await page.evaluate((y) => window.scrollTo(0, y), shot.scrollY);
  const path = `${OUT_DIR}${shot.name}.${shot.phone ? "jpg" : "png"}`;
  await page.screenshot(shot.phone ? { path, type: "jpeg", quality: 82 } : { path });
  console.log(`saved ${path}`);
  await page.close();
}

await browser.close();
