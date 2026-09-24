import { expect, test } from "@playwright/test";

const PAGES = [
  { path: "/", lang: "id", toggle: "EN", other: "/en/" },
  { path: "/en/", lang: "en", toggle: "ID", other: "/" },
];

for (const p of PAGES) {
  test.describe(`page ${p.path}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(p.path);
    });

    test("renders the headline in the right language", async ({ page }) => {
      await expect(page.locator("html")).toHaveAttribute("lang", p.lang);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    test("points every WhatsApp button at the right number with a message", async ({ page }) => {
      const links = page.locator('a[href^="https://wa.me/"]');
      expect(await links.count()).toBeGreaterThanOrEqual(2);
      for (const href of await links.evaluateAll((els) => els.map((e) => e.getAttribute("href")))) {
        expect(href).toMatch(/^https:\/\/wa\.me\/6285717913273\?text=.+/);
      }
    });

    test("switches language with the toggle", async ({ page }) => {
      await page.getByRole("link", { name: p.toggle, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${p.other.replace(/\//g, "\\/")}$`));
    });

    test("has no horizontal scroll", async ({ page }) => {
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });

    // On phones the needs table stacks and its header row is hidden, so each
    // part of a row carries its own label, worded like the column header.
    test("labels each part of a needs row on phones", async ({ page }, testInfo) => {
      const section = page.locator('section[aria-labelledby="needs-title"]');
      const headers = await section.locator("thead th").allTextContents();
      const labels = section.locator("tbody tr").first().locator(".cell-label");
      if (testInfo.project.name === "mobile") {
        await expect(labels).toHaveCount(headers.length);
        for (const [i, header] of headers.entries()) {
          await expect(labels.nth(i)).toBeVisible();
          expect((await labels.nth(i).textContent())?.replace(":", "").trim()).toBe(header.trim());
        }
      } else {
        await expect(section.locator("thead")).toBeVisible();
        for (const label of await labels.all()) await expect(label).toBeHidden();
      }
    });

    test("gives every image alt text", async ({ page }) => {
      const missing = await page.locator("img").evaluateAll((imgs) =>
        imgs.filter((img) => !img.getAttribute("alt")?.trim()).map((img) => img.getAttribute("src")),
      );
      expect(missing).toEqual([]);
    });

    test("tells search engines Adyan is a software engineer", async ({ page }) => {
      const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
      expect(JSON.parse(jsonLd ?? "{}").jobTitle).toBe("Software Engineer");
    });

    test("sets an absolute Open Graph image for link previews", async ({ page }) => {
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        /^https:\/\/adyan\.admos\.id\/og-(id|en)\.png$/,
      );
    });
  });
}

// The main WhatsApp button must be fully visible before any scrolling, on
// small laptops (1366x768 minus browser chrome) and small phones.
const FOLD_VIEWPORTS = {
  desktop: [
    { width: 1920, height: 950 },
    { width: 1536, height: 730 },
    { width: 1470, height: 776 },
    { width: 1366, height: 650 },
    { width: 1280, height: 650 },
    { width: 1024, height: 650 },
  ],
  mobile: [
    { width: 412, height: 780 },
    { width: 390, height: 664 },
    { width: 360, height: 640 },
  ],
};

for (const p of PAGES) {
  test(`shows the whole hero WhatsApp button on first open at ${p.path}`, async ({ page }, testInfo) => {
    for (const viewport of FOLD_VIEWPORTS[testInfo.project.name as keyof typeof FOLD_VIEWPORTS]) {
      await page.setViewportSize(viewport);
      await page.goto(p.path);
      await page.evaluate(() => document.fonts.ready);
      const box = await page.locator(".hero .cta .button").boundingBox();
      expect(box, `${viewport.width}x${viewport.height}`).not.toBeNull();
      expect(box!.y + box!.height, `${viewport.width}x${viewport.height}`).toBeLessThanOrEqual(viewport.height - 12);
    }
  });
}
