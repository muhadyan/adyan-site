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

    test("gives every image alt text", async ({ page }) => {
      const missing = await page.locator("img").evaluateAll((imgs) =>
        imgs.filter((img) => !img.getAttribute("alt")?.trim()).map((img) => img.getAttribute("src")),
      );
      expect(missing).toEqual([]);
    });

    test("sets an absolute Open Graph image for link previews", async ({ page }) => {
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        /^https:\/\/adyan\.admos\.id\/og-(id|en)\.png$/,
      );
    });
  });
}
