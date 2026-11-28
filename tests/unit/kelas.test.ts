import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { KELAS, SITE } from "../../src/config";
import { kelas } from "../../src/content/kelas";
import { kelasClosed } from "../../src/lib/kelas";

// The "AI untuk Kerja" class page (/kelas). Copy comes from Cue as written; these tests pin the
// parts other code or the ads depend on.

describe("KELAS config", () => {
  it("keeps the sign-up form link in one https Google Forms value", () => {
    const url = new URL(KELAS.formUrl);
    expect(url.protocol).toBe("https:");
    expect(url.hostname === "forms.gle" || url.href.startsWith("https://docs.google.com/forms/")).toBe(true);
  });

  it("closes sign-ups on Tue 8 Dec 2026 at 23:59 WIB", () => {
    expect(new Date(KELAS.closesAt).toISOString()).toBe("2026-12-08T16:59:59.000Z");
  });
});

describe("kelasClosed", () => {
  it("is open weeks before the deadline", () => {
    expect(kelasClosed(new Date("2026-11-22T10:00:00+07:00"), KELAS.closesAt)).toBe(false);
  });

  it("is still open during the last minute, 23:59 WIB", () => {
    expect(kelasClosed(new Date("2026-12-08T23:59:00+07:00"), KELAS.closesAt)).toBe(false);
    expect(kelasClosed(new Date("2026-12-08T23:59:59+07:00"), KELAS.closesAt)).toBe(false);
  });

  it("is closed from midnight WIB on Wed 9 Dec", () => {
    expect(kelasClosed(new Date("2026-12-09T00:00:00+07:00"), KELAS.closesAt)).toBe(true);
    expect(kelasClosed(new Date("2026-12-12T09:30:00+07:00"), KELAS.closesAt)).toBe(true);
  });

  it("treats an unreadable deadline as open, so the buttons never vanish by mistake", () => {
    expect(kelasClosed(new Date("2026-12-20T00:00:00+07:00"), "not a date")).toBe(false);
  });
});

describe("kelas copy", () => {
  it("uses the share title from the brief", () => {
    expect(kelas.meta.title).toBe("AI untuk Kerja · Kelas gratis 12 Des");
  });

  it("shows the class facts as chips in the brief's order", () => {
    expect(kelas.hero.chips.join(" · ")).toBe("Gratis · 10 kursi · Sabtu, 12 Des 2026 · 09.30-11.30 WIB · Zoom");
  });

  it("lists the four sign-up steps", () => {
    expect(kelas.steps.items).toHaveLength(4);
  });

  // Cue's fix (2026-11-22): "13 orang" next to "10 kursi" read as a contradiction.
  it("does not name a head count in the picking step", () => {
    expect(kelas.steps.items[1]).toBe("Aku pilih peserta pada Rabu 9 Des.");
  });

  it("links the data answer to the site's WhatsApp and email", () => {
    const data = kelas.faq.items.find((item) => item.q === "Data kamu");
    const links = Array.isArray(data?.a) ? data.a.filter((part) => typeof part !== "string") : [];
    expect(links).toEqual([
      { text: "WhatsApp", href: `https://wa.me/${SITE.whatsapp}` },
      { text: "email", href: `mailto:${SITE.email}` },
    ]);
  });

  // Adyan's term (2026-11-28): "orang non-IT", not "bukan orang IT".
  it("says the class is for orang non-IT, in the hero and the share preview", () => {
    expect(kelas.hero.subtitle).toBe("Kelas praktik 2 jam untuk orang non-IT.");
    expect(kelas.meta.description).toBe(kelas.hero.subtitle);
  });

  it("marks the audience as Non-IT", () => {
    expect(kelas.audience.body).toContain(" Non-IT. ");
  });

  it("never says 'bukan orang IT'", () => {
    expect(JSON.stringify(kelas)).not.toMatch(/bukan orang IT/i);
  });

  it("says the Finance, HR and GA lead was the trainer's last role", () => {
    expect(kelas.trainer.body).toContain("5+ tahun di Finance, terakhir pimpin Finance, HR dan GA.");
  });

  it("names no employer but Tokopedia", () => {
    const text = JSON.stringify(kelas);
    expect(text).toContain("ex Tokopedia");
    for (const name of ["Gojek", "Grab", "Shopee", "Traveloka", "Bukalapak", "Admos"]) {
      expect(text).not.toContain(name);
    }
  });
});

describe("kelas share image", () => {
  it("is committed next to the other link-preview cards", () => {
    expect(existsSync(new URL("../../public/og-kelas.png", import.meta.url))).toBe(true);
  });
});
