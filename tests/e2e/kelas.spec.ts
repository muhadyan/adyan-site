import { expect, test, type Page } from "@playwright/test";
import { KELAS, SITE } from "../../src/config";
import { kelasClosed } from "../../src/lib/kelas";

// The "AI untuk Kerja" class page. Every test pins the browser clock, so the suite gives the
// same result before and after the sign-up deadline (Tue 8 Dec 2026, 23:59 WIB).
const OPEN = new Date("2026-11-22T10:00:00+07:00");
const LAST_SECOND = new Date("2026-12-08T23:59:59+07:00");
const CLOSED = new Date("2026-12-09T00:00:00+07:00");
const CLOSED_TEXT = "Pendaftaran sudah ditutup";

async function openAt(page: Page, time: Date): Promise<void> {
  await page.clock.setFixedTime(time);
  await page.goto("/kelas/");
}

const daftar = (page: Page) => page.locator('a[data-umami-event="kelas-apply"]');
const heroButton = (page: Page) => daftar(page).and(page.locator('[data-umami-event-spot="hero"]'));
const bottomButton = (page: Page) => daftar(page).and(page.locator('[data-umami-event-spot="bottom"]'));
const sticky = (page: Page) => page.locator(".sticky-kelas");

test.describe("page /kelas/", () => {
  test("renders the class headline in Indonesian", async ({ page }) => {
    await openAt(page, OPEN);
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("AI untuk Kerja");
    for (const title of ["Untuk siapa", "Bukan untuk", "Yang kamu kerjakan", "Yang kamu bawa pulang", "Trainer", "Cara daftar"]) {
      await expect(page.getByRole("heading", { level: 2, name: title })).toBeVisible();
    }
  });

  test("sets the page title and share preview", async ({ page }) => {
    await openAt(page, OPEN);
    const title = "AI untuk Kerja · Kelas gratis 12 Des";
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", /\S/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://adyan.admos.id/og-kelas.png");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://adyan.admos.id/kelas/");
    // Indonesian only: no English twin to point at.
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
  });

  test("points every Daftar button at the form link from the config", async ({ page }) => {
    await openAt(page, OPEN);
    const buttons = daftar(page);
    await expect(buttons).toHaveCount(3);
    for (const button of await buttons.all()) {
      await expect(button).toHaveAttribute("href", KELAS.formUrl);
      await expect(button).toHaveAttribute("target", "_blank");
      await expect(button).toHaveAttribute("rel", "noopener");
      await expect(button).toContainText("Daftar (5 menit)");
    }
  });

  test("tracks every Daftar click as kelas-apply with its spot", async ({ page }) => {
    await openAt(page, OPEN);
    const events = await daftar(page).evaluateAll((els) =>
      els.map((e) => [e.getAttribute("data-umami-event"), e.getAttribute("data-umami-event-spot")]),
    );
    expect(events).toEqual(["hero", "bottom", "sticky"].map((spot) => ["kelas-apply", spot]));
  });

  test("loads the Umami tracker for the live domain only", async ({ page }) => {
    await openAt(page, OPEN);
    const tracker = page.locator(`script[src="${SITE.umamiSrc}"]`);
    await expect(tracker).toHaveAttribute("data-website-id", SITE.umamiId);
    await expect(tracker).toHaveAttribute("data-domains", "adyan.admos.id");
  });

  test("keeps the buttons during the last second before the deadline", async ({ page }) => {
    await openAt(page, LAST_SECOND);
    await expect(heroButton(page)).toBeVisible();
    await expect(bottomButton(page)).toBeVisible();
    await expect(page.getByText("Pendaftaran tutup Selasa, 8 Des 2026, 23.59 WIB.").first()).toBeVisible();
    await expect(page.getByText(CLOSED_TEXT)).toHaveCount(2);
    for (const note of await page.getByText(CLOSED_TEXT).all()) await expect(note).toBeHidden();
  });

  test("shows 'Pendaftaran sudah ditutup' instead of the buttons after the deadline", async ({ page }) => {
    await openAt(page, CLOSED);
    for (const note of await page.getByText(CLOSED_TEXT).all()) await expect(note).toBeVisible();
    for (const button of await daftar(page).all()) await expect(button).toBeHidden();
    // The phone bar stays away too, wherever the visitor scrolls.
    await page.locator("#faq-title").scrollIntoViewIfNeeded();
    await expect(sticky(page)).toBeHidden();
  });

  test("links the data answer to the site's WhatsApp and email", async ({ page }) => {
    await openAt(page, OPEN);
    await page.getByText("Data kamu").click();
    await expect(page.getByRole("link", { name: "WhatsApp", exact: true })).toHaveAttribute("href", `https://wa.me/${SITE.whatsapp}`);
    await expect(page.getByRole("link", { name: "email", exact: true })).toHaveAttribute("href", `mailto:${SITE.email}`);
  });

  test("has no horizontal scroll", async ({ page }) => {
    await openAt(page, OPEN);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("shows the whole hero Daftar button on first open", async ({ page }, testInfo) => {
    const viewports =
      testInfo.project.name === "mobile"
        ? [{ width: 412, height: 780 }, { width: 390, height: 664 }, { width: 360, height: 640 }]
        : [{ width: 1920, height: 950 }, { width: 1366, height: 650 }, { width: 1024, height: 650 }];
    await page.clock.setFixedTime(OPEN);
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto("/kelas/");
      await page.evaluate(() => document.fonts.ready);
      const box = await heroButton(page).boundingBox();
      expect(box, `${viewport.width}x${viewport.height}`).not.toBeNull();
      expect(box!.y + box!.height, `${viewport.width}x${viewport.height}`).toBeLessThanOrEqual(viewport.height - 12);
    }
  });

  test("shows the phone Daftar bar only between the hero and bottom buttons", async ({ page }, testInfo) => {
    await openAt(page, OPEN);
    const bar = sticky(page);
    if (testInfo.project.name !== "mobile") {
      await expect(bar).toBeHidden();
      return;
    }
    await expect(bar).not.toHaveAttribute("data-shown");
    await page.locator("#faq-title").scrollIntoViewIfNeeded();
    await expect(bar).toHaveAttribute("data-shown", "");
    await expect(bar).toBeInViewport();
    await bottomButton(page).scrollIntoViewIfNeeded();
    await expect(bar).not.toHaveAttribute("data-shown");
  });
});

test("keeps the class copy readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/kelas/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("AI untuk Kerja");
  await expect(page.getByText("Kelas praktik 2 jam untuk orang non-IT.").first()).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Cara daftar" })).toBeVisible();
  // Without the script the build-time state decides: buttons before the deadline, the notice after.
  if (kelasClosed(new Date(), KELAS.closesAt)) {
    await expect(page.getByText(CLOSED_TEXT).first()).toBeVisible();
  } else {
    await expect(heroButton(page)).toBeVisible();
    await expect(bottomButton(page)).toBeVisible();
  }
  await context.close();
});

// Adyan decides later where the page is linked; until then no other page points at it.
test("is not linked from any other page", async ({ page }) => {
  for (const path of ["/", "/en/", "/website/", "/kasir/", "/pembukuan/", "/privacy/", "/terms/"]) {
    await page.goto(path);
    await expect(page.locator('a[href*="kelas"]'), path).toHaveCount(0);
  }
});
