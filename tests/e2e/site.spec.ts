import { expect, test } from "@playwright/test";
import { SITE } from "../../src/config";

const PAGES = [
  { path: "/", lang: "id", toggle: "EN", other: "/en/", lane: "home" },
  { path: "/en/", lang: "en", toggle: "ID", other: "/", lane: "home" },
  ...["website", "kasir", "pembukuan"].flatMap((lane) => [
    { path: `/${lane}/`, lang: "id", toggle: "EN", other: `/en/${lane}/`, lane },
    { path: `/en/${lane}/`, lang: "en", toggle: "ID", other: `/${lane}/`, lane },
  ]),
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
        expect(href).toMatch(new RegExp(`^https://wa\\.me/${SITE.whatsapp}\\?text=.+`));
      }
    });

    test("loads the Umami tracker for the live domain only", async ({ page }) => {
      const tracker = page.locator(`script[src="${SITE.umamiSrc}"]`);
      await expect(tracker).toHaveAttribute("data-website-id", SITE.umamiId);
      await expect(tracker).toHaveAttribute("data-domains", "adyan.admos.id");
    });

    test("tracks every WhatsApp button click with its spot and lane", async ({ page }) => {
      const spots = await page
        .locator('a[href^="https://wa.me/"]')
        .evaluateAll((els) =>
          els.map((e) => [
            e.getAttribute("data-umami-event"),
            e.getAttribute("data-umami-event-spot"),
            e.getAttribute("data-umami-event-lane"),
          ]),
        );
      expect(spots).toEqual(
        ["header", "hero", "footer", "sticky"].map((spot) => ["wa-click", spot, p.lane]),
      );
    });

    test("prefills the same WhatsApp message on every button of the page", async ({ page }) => {
      const hrefs = await page
        .locator('a[href^="https://wa.me/"]')
        .evaluateAll((els) => els.map((e) => e.getAttribute("href")));
      expect(new Set(hrefs).size).toBe(1);
      const text = new URL(hrefs[0]!).searchParams.get("text") ?? "";
      if (p.lane !== "home") expect(text).toMatch(p.lane === "kasir" ? /kasir|POS/ : new RegExp(p.lane === "website" ? "website" : "pembukuan|bookkeeping"));
    });

    // Umami sends same-tab links with location.href, which drops "download",
    // so the CV link opens in a new tab to keep the download working.
    test("tracks CV downloads without breaking the download", async ({ page }) => {
      const cv = page.locator(`a[href="${SITE.cv}"]`);
      await expect(cv).toHaveAttribute("data-umami-event", "cv-download");
      await expect(cv).toHaveAttribute("target", "_blank");
      await expect(cv).toHaveAttribute("download", "");
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

    // Images inside a link with its own text are decorative (alt=""); every other image needs words.
    test("gives every image alt text", async ({ page }) => {
      const missing = await page.locator("img").evaluateAll((imgs) =>
        imgs
          .filter((img) => {
            const alt = img.getAttribute("alt");
            if (alt === null) return true;
            const link = img.closest("a");
            return !alt.trim() && !(link && link.textContent?.trim());
          })
          .map((img) => img.getAttribute("src")),
      );
      expect(missing).toEqual([]);
    });

    test("tells search engines Adyan is a software engineer behind Admos ERP", async ({ page }) => {
      const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
      const nodes: Array<Record<string, unknown>> = JSON.parse(jsonLd ?? "{}")["@graph"] ?? [];
      expect(nodes.find((n) => n["@type"] === "Person")?.jobTitle).toBe("Software Engineer");
      expect(nodes.find((n) => n["@type"] === "ProfessionalService")?.name).toBe("Admos ERP");
    });

    test("shows the Maps listing name, address and phone in the footer", async ({ page }) => {
      const address = page.locator("footer address");
      await expect(address).toContainText("Admos ERP");
      await expect(address).toContainText("Maguwoharjo");
      await expect(address.locator('a[href^="tel:+62"]')).toBeVisible();
      await expect(page.locator("footer iframe")).toHaveAttribute("src", /google\.com\/maps.*output=embed/);
    });

    test("sets an absolute Open Graph image for link previews", async ({ page }) => {
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        new RegExp(`^https://adyan\\.admos\\.id/og-${p.lane === "home" ? "" : `${p.lane}-`}${p.lang}\\.png$`),
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

// Phones get a bottom WhatsApp bar, but never next to another WhatsApp button.
for (const path of ["/", "/kasir/"]) {
  test(`shows the phone WhatsApp bar only between the hero and footer buttons at ${path}`, async ({ page }, testInfo) => {
    const bar = page.locator(".sticky-wa");
    await page.goto(path);
    if (testInfo.project.name !== "mobile") {
      await expect(bar).toBeHidden();
      return;
    }
    await expect(bar).not.toHaveAttribute("data-shown");
    await page.locator("#faq-title").scrollIntoViewIfNeeded();
    await expect(bar).toHaveAttribute("data-shown", "");
    await expect(bar).toBeInViewport();
    await page.locator(".footer .cta .button").scrollIntoViewIfNeeded();
    await expect(bar).not.toHaveAttribute("data-shown");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(bar).not.toHaveAttribute("data-shown");
  });
}

test("home lane cards open each lane page", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.locator('a[data-umami-event="lane-open"]').evaluateAll((els) => els.map((e) => e.getAttribute("href")));
  expect(hrefs).toEqual(["/website/", "/kasir/", "/pembukuan/"]);
});

test("shows the bookkeeping and ERP packages with their starting prices", async ({ page }) => {
  await page.goto("/pembukuan/");
  await expect(page.getByRole("article", { name: "Paket Pembukuan" })).toContainText("Rp10 juta");
  await expect(page.getByRole("article", { name: "Paket ERP" })).toContainText("Rp25 juta");
});

// Google's OAuth consent screen links here (Gmail send-only app for pitch emails).
test("privacy page explains the email tool and names a contact", async ({ page }) => {
  await page.goto("/privacy/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Privacy/i);
  await expect(page.getByText(/gmail\.send/)).toBeVisible();
  await expect(page.locator(`a[href="mailto:${SITE.email}"]`).first()).toBeVisible();
});

// The TikTok for Developers app "Admos" links to both pages.
test("terms page explains the TikTok draft tool and links privacy", async ({ page }) => {
  await page.goto("/terms/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Terms/i);
  await expect(page.getByText(/TikTok inbox/)).toBeVisible();
  await expect(page.locator('a[href="/privacy/"]')).toBeVisible();
  await expect(page.locator(`a[href="mailto:${SITE.email}"]`).first()).toBeVisible();
});

test("privacy page names the TikTok scopes", async ({ page }) => {
  await page.goto("/privacy/");
  await expect(page.getByText(/video\.upload/).first()).toBeVisible();
});
