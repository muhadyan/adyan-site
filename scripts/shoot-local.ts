// Captures logged-in screens from LOCAL dev instances seeded with fake demo data.
// Usage: DEMO_EMAIL=... DEMO_PASSWORD=... bun scripts/shoot-local.ts <app>
// Never point this at production.
import { chromium, type Page } from "@playwright/test";

type App = {
  base: string;
  login: (page: Page, email: string, password: string) => Promise<void>;
  shots: { name: string; path: string; before?: (page: Page) => Promise<void> }[];
};

const APPS: Record<string, App> = {
  admos: {
    base: "http://localhost:3101",
    login: async (page, email, password) => {
      await page.goto("http://localhost:3101/login");
      await page.locator('input[type="email"]').fill(email);
      await page.locator('input[type="password"]').fill(password);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 20_000 });
    },
    shots: [
      { name: "admos-dashboard", path: "/dashboard" },
      {
        name: "admos-laba-rugi",
        path: "/laporan/laba-rugi",
        before: async (page) => {
          await page.getByRole("button", { name: "Tampilkan" }).click();
          await page.waitForLoadState("networkidle");
        },
      },
      { name: "admos-jurnal", path: "/jurnal" },
    ],
  },
};

const appName = process.argv[2] ?? "";
const app = APPS[appName];
const email = process.env.DEMO_EMAIL;
const password = process.env.DEMO_PASSWORD;
if (!app || !email || !password) {
  console.error(`usage: DEMO_EMAIL=.. DEMO_PASSWORD=.. bun scripts/shoot-local.ts <${Object.keys(APPS).join("|")}>`);
  process.exit(1);
}
if (!app.base.startsWith("http://localhost")) throw new Error("local instances only");

const OUT_DIR = new URL("../src/assets/work/", import.meta.url).pathname;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: "id-ID" });
await app.login(page, email, password);
for (const shot of app.shots) {
  await page.goto(app.base + shot.path, { waitUntil: "networkidle" });
  await shot.before?.(page);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT_DIR}${shot.name}.png` });
  console.log(`saved ${shot.name}`);
}
await browser.close();
