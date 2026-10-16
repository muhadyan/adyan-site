// Captures logged-in screens from the LOCAL Admos e2e stack seeded with fake demo
// data (scripts/demo-stack.sh, then scripts/seed-local-demo.sh).
// Usage: DEMO_EMAIL=... DEMO_PASSWORD=... bun scripts/shoot-local.ts [name ...]   (no names = all)
// Optional: SCREENS_DIR=<dir> also writes the Threads bot copies; CATAT_PHOTO=<image>
// replaces the fictional receipt (scripts/demo/nota-toko-kain.jpg) that the Catat dari
// Foto shot sends when the business has no Catat thread yet (one AI call).
// Never point this at production: every base must be localhost or *.localhost.
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium, type Browser, type BrowserContext, type Page } from "@playwright/test";

const ACC_WEB = process.env.ACC_WEB_URL ?? "http://accounting.admos.localhost:18083";
const LARIS_WEB = process.env.LARIS_WEB_URL ?? "http://laris.admos.localhost:18082";
const ACC_API = process.env.ACC_API_URL ?? "http://api.admos.localhost:18080";
const LARIS_API = process.env.LARIS_API_URL ?? "http://laris-api.admos.localhost:18081";
const COOKIE_DOMAIN = `.${process.env.E2E_COOKIE_DOMAIN ?? "admos.localhost"}`;

type Device = "desktop" | "phone";
type Shot = {
  name: string;
  app: "acc" | "laris" | "public";
  device: Device;
  path: string;
  /** Extra file name for the Threads bot library (SCREENS_DIR). */
  lib?: string;
  /** Only written to SCREENS_DIR, not to the site. */
  libOnly?: boolean;
  ready: string;
  before?: (page: Page) => Promise<void>;
  after?: () => Promise<void>;
};

/** The report address for this month; the page runs it once the business loads. */
function thisMonth(): string {
  const now = new Date();
  const day = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  return `dari=${day(new Date(now.getFullYear(), now.getMonth(), 1))}&sampai=${day(new Date(now.getFullYear(), now.getMonth() + 1, 0))}`;
}

const SHOTS: Shot[] = [
  { name: "admos-dashboard", app: "acc", device: "desktop", path: "/dashboard", ready: "text=Rp >> visible=true" },
  {
    name: "admos-laba-rugi",
    app: "acc",
    device: "desktop",
    path: `/laporan/laba-rugi?${thisMonth()}`,
    ready: "text=Rp >> visible=true",
  },
  { name: "admos-jurnal", app: "acc", device: "desktop", path: "/jurnal", ready: "text=Rp >> visible=true" },
  {
    name: "laris-saldo",
    app: "laris",
    device: "desktop",
    path: "/saldo",
    ready: "text=Bisa dicairkan",
    before: (page) => page.locator("summary", { hasText: "Riwayat saldo" }).click(),
  },
  { name: "admos-laris", app: "public", device: "desktop", path: "/", ready: "h1" },
  {
    name: "admos-dashboard-mobile",
    lib: "acc-beranda-new",
    app: "acc",
    device: "phone",
    path: "/dashboard",
    ready: "text=Rp >> visible=true",
  },
  {
    name: "admos-foto-nota-mobile",
    lib: "acc-catat-foto",
    app: "acc",
    device: "phone",
    path: "/catat",
    ready: "textarea, input[type=file]",
    before: catatFromPhoto,
  },
  {
    name: "acc-laporan-mobile",
    libOnly: true,
    app: "acc",
    device: "phone",
    path: `/laporan/laba-rugi?${thisMonth()}`,
    ready: "text=Rp >> visible=true",
    // The period form fills the first screen; start at the plain/accountant tabs.
    before: async (page) => {
      await page.getByText("Untung bersih").first().waitFor();
      await page.waitForTimeout(1500); // the breakdown lays out after the figure
      await scrollToTop(page, "text=Sederhana", 76);
    },
  },
  {
    name: "laris-hari-ini-mobile",
    lib: "laris-hari-ini",
    app: "laris",
    device: "phone",
    path: "/hari-ini",
    ready: "text=Rp >> visible=true",
    before: rememberLabelPrinter,
  },
  { name: "laris-produk", libOnly: true, app: "laris", device: "phone", path: "/produk", ready: "text=Rp >> visible=true" },
  {
    name: "laris-label",
    libOnly: true,
    app: "laris",
    device: "phone",
    path: "/label",
    ready: "text=Pilih varian",
    before: labelPreview,
  },
  // Last: the cart it leaves behind would show as a badge on later Laris shots.
  {
    name: "laris-kasir-mobile",
    lib: "laris-kasir-new",
    app: "laris",
    device: "phone",
    path: "/kasir",
    ready: "text=Cari Produk",
    before: fillCart,
    after: cancelCartOrders,
  },
];

const CART = ["Dress Batik Mega Mendung", "Kemeja Batik Parang", "Selendang Batik Lasem", "Kain Batik Tulis"];

/** Unpaid orders today, so the cart the Kasir shot leaves behind can be cancelled after it. */
async function openOrders(): Promise<string[]> {
  const res = await fetch(`${LARIS_API}/v1/orders?limit=200`, { headers: larisHeaders() });
  const body = (await res.json()) as { data?: { id: string; status: string }[] | { orders?: { id: string; status: string }[] } };
  const list = Array.isArray(body.data) ? body.data : (body.data?.orders ?? []);
  return list.filter((o) => o.status !== "paid" && o.status !== "cancelled").map((o) => o.id);
}

let ordersBeforeCart: string[] = [];

async function cancelCartOrders() {
  for (const id of (await openOrders()).filter((id) => !ordersBeforeCart.includes(id))) {
    const res = await fetch(`${LARIS_API}/v1/orders/${id}/cancel`, { method: "POST", headers: larisHeaders(), body: "{}" });
    console.log(`cancelled the Kasir shot's cart ${id}: HTTP ${res.status}`);
  }
}

async function fillCart(page: Page) {
  ordersBeforeCart = await openOrders();
  // Headless Chromium has no camera; switched off it reads "Kamera dimatikan", not an error.
  const cameraOff = page.getByRole("button", { name: "Matikan Kamera" });
  if (await cameraOff.isVisible()) await cameraOff.click();
  for (const term of CART) {
    await page.getByRole("button", { name: "Cari Produk" }).click();
    await page.locator("#cari-produk").fill(term);
    await page.getByRole("button", { name: new RegExp(term) }).first().click();
  }
  await page.getByRole("button", { name: /^Bayar Rp/ }).waitFor();
}

/** Scrolls the element's own scroll area so it sits `gap` pixels under the top (below a sticky header). */
async function scrollToTop(page: Page, selector: string, gap: number) {
  await page.locator(selector).first().evaluate((el, gap) => {
    let box = el.parentElement;
    const scrolls = (node: HTMLElement) =>
      node.scrollHeight > node.clientHeight && /auto|scroll/.test(getComputedStyle(node).overflowY);
    while (box && box !== document.body && !scrolls(box)) box = box.parentElement;
    const top = el.getBoundingClientRect().top;
    if (box && box !== document.body) {
      box.scrollBy(0, top - box.getBoundingClientRect().top - gap);
      return;
    }
    const header = document.querySelector("header");
    const sticky = header && getComputedStyle(header).position === "sticky" ? header.offsetHeight : 0;
    window.scrollBy(0, top - sticky - gap);
  }, gap);
}

/** Every variant's labels at its stock count, then the first sheet's preview in view. */
async function labelPreview(page: Page) {
  const fill = page.getByRole("button", { name: "Isi sesuai stok", exact: true });
  await fill.and(page.locator(":enabled")).waitFor();
  await fill.click();
  await page.locator("canvas[aria-label^='Pratinjau']").first().waitFor();
  await scrollToTop(page, "text=Pratinjau", 96);
}

/** The setup card asks for a label printer until this phone remembers one. */
async function rememberLabelPrinter(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const open = indexedDB.open("laris");
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const store = open.result.transaction("settings", "readwrite").objectStore("settings");
          const read = store.get("app");
          read.onsuccess = () => {
            const value = read.result?.value ?? {};
            const printers = { ...value.printers, label: { id: "demo", name: "Printer label" } };
            store.put({ key: "app", value: { ...value, printers } }).onsuccess = () => resolve();
          };
        };
      }),
  );
  await page.reload({ waitUntil: "load" });
  await page.locator("text=Rp >> visible=true").first().waitFor();
}

/** Opens the newest Catat thread, or sends the receipt photo to start one, and waits for its draft. */
async function catatFromPhoto(page: Page) {
  const thread = page.locator('a[href^="/catat/"]').first();
  if (await thread.isVisible()) {
    await thread.click();
  } else {
    const photo = process.env.CATAT_PHOTO ?? new URL("demo/nota-toko-kain.jpg", import.meta.url).pathname;
    await page.locator("input[type=file]").first().setInputFiles(photo);
    await page.getByRole("button", { name: /^Kirim/ }).click();
  }
  const save = page.getByRole("button", { name: "Simpan", exact: true }).first();
  await save.waitFor({ timeout: 120_000 });
  // The demo nota is stamped LUNAS: answer the model's "paid with what?" with Kas.
  const kas = page.getByRole("button", { name: "Kas", exact: true });
  if (await kas.isVisible()) await kas.click();
  await save.and(page.locator(":enabled")).waitFor({ timeout: 120_000 });
}

function assertLocal(url: string) {
  const host = new URL(url).hostname;
  if (host !== "localhost" && !host.endsWith(".localhost")) throw new Error(`local instances only: ${url}`);
}

type Session = { cookie: string; larisToken: string; larisAccount: unknown };

const larisHeaders = () => ({
  Authorization: `Bearer ${session.larisToken}`,
  Origin: LARIS_WEB,
  "Content-Type": "application/json",
});

async function signIn(email: string, password: string): Promise<Session> {
  const origin = { Origin: LARIS_WEB, "Content-Type": "application/json" };
  const login = await fetch(`${ACC_API}/v1/auth/login`, {
    method: "POST",
    headers: origin,
    body: JSON.stringify({ email, password }),
  });
  const cookie = login.headers.getSetCookie().find((c) => c.startsWith("admos_session="))?.split(";")[0];
  if (!login.ok || !cookie) throw new Error(`sign-in failed: HTTP ${login.status}`);
  const exchange = await fetch(`${LARIS_API}/v1/auth/exchange`, {
    method: "POST",
    headers: { ...origin, Cookie: cookie },
    body: "{}",
  });
  const body = (await exchange.json()) as { data?: { token?: string; account?: unknown } };
  if (!exchange.ok || !body.data?.token) throw new Error(`Laris exchange failed: HTTP ${exchange.status}`);
  return { cookie: cookie.slice("admos_session=".length), larisToken: body.data.token, larisAccount: body.data.account };
}

const HIDDEN_CSS = [
  "nextjs-portal",
  'button[aria-label="Laporkan Masalah"]',
  "p.banner:has(.lucide-flask-conical)",
  // Laris "Pesanan Kirim" (shipping orders) is not on the published claim register yet.
  'a[href="/kirim"]',
  // Nor is the QRIS payout timing: the Saldo row "Masih menunggu, masuk 2 hari kerja".
  // The seed settles every QRIS sale, so that row only says Rp 0.
  'section[aria-labelledby="bisa-dicairkan"] .card-rule + .figure-row',
].join(",") + "{display:none!important}";

async function newContext(browser: Browser, device: Device, session: Session | null): Promise<BrowserContext> {
  const base = { locale: "id-ID", timezoneId: "Asia/Jakarta" };
  const context = await browser.newContext(
    device === "desktop"
      ? { ...base, viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }
      : { ...base, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  );
  // Nothing may reach a real Admos host, even an analytics beacon.
  await context.route("**/*", (route) => {
    const host = new URL(route.request().url()).hostname;
    return host === "admos.id" || host.endsWith(".admos.id") ? route.abort() : route.fallback();
  });
  // Hidden: the Next dev overlay, the bug-report button, the "Mode uji" banner that
  // the local QRIS stand-in (scripts/fake-duitku.ts) triggers, Pesanan Kirim, and the
  // Saldo payout-timing row.
  await context.addInitScript((css) => {
    const hide = () => {
      const style = document.createElement("style");
      style.textContent = css;
      document.documentElement.appendChild(style);
    };
    if (document.documentElement) hide();
    else document.addEventListener("DOMContentLoaded", hide);
  }, HIDDEN_CSS);
  if (session) {
    await context.addCookies([
      { name: "admos_session", value: session.cookie, domain: COOKIE_DOMAIN, path: "/", httpOnly: true },
    ]);
    await context.addInitScript(
      ({ host, token, account }) => {
        if (location.host !== host) return;
        localStorage.setItem("laris.token", token);
        localStorage.setItem("laris.admosAccount", JSON.stringify(account));
      },
      { host: new URL(LARIS_WEB).host, token: session.larisToken, account: session.larisAccount },
    );
  }
  return context;
}

const wanted = new Set(process.argv.slice(2));
const shots = wanted.size ? SHOTS.filter((s) => wanted.has(s.name)) : SHOTS;
const email = process.env.DEMO_EMAIL;
const password = process.env.DEMO_PASSWORD;
if (!email || !password || shots.length === 0) {
  console.error(`usage: DEMO_EMAIL=.. DEMO_PASSWORD=.. bun scripts/shoot-local.ts [${SHOTS.map((s) => s.name).join("|")}]`);
  process.exit(1);
}
[ACC_WEB, LARIS_WEB, ACC_API, LARIS_API].forEach(assertLocal);

const OUT_DIR = new URL("../src/assets/work/", import.meta.url).pathname;
const SCREENS_DIR = process.env.SCREENS_DIR?.replace(/\/?$/, "/");
const session = await signIn(email, password);
const browser = await chromium.launch();
const contexts = new Map<string, BrowserContext>();

for (const shot of shots) {
  const key = `${shot.device}:${shot.app === "public" ? "public" : "signed-in"}`;
  if (!contexts.has(key)) contexts.set(key, await newContext(browser, shot.device, shot.app === "public" ? null : session));
  const page = await contexts.get(key)!.newPage();
  const base = shot.app === "acc" ? ACC_WEB : LARIS_WEB;
  await page.goto(base + shot.path, { waitUntil: "load" });
  try {
    await page.locator(shot.ready).first().waitFor({ timeout: 60_000 });
    await shot.before?.(page);
  } catch (err) {
    await page.screenshot({ path: join(tmpdir(), `shoot-failed-${shot.name}.png`), fullPage: true });
    throw new Error(`${shot.name}: not ready at ${page.url()} (see shoot-failed-${shot.name}.png)`, { cause: err });
  }
  await page.waitForTimeout(2000);
  const targets = [
    ...(shot.libOnly ? [] : [`${OUT_DIR}${shot.name}.png`]),
    ...(SCREENS_DIR && (shot.lib || shot.libOnly) ? [`${SCREENS_DIR}${shot.lib ?? shot.name}.png`] : []),
  ];
  for (const path of targets) {
    await page.screenshot({ path });
    console.log(`saved ${path}`);
  }
  await page.close();
  await shot.after?.();
}
await browser.close();
