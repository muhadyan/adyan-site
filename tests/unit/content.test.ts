import { describe, expect, it } from "vitest";
import { id } from "../../src/content/id";
import { en } from "../../src/content/en";
import { WORK } from "../../src/data/work";

/** Collects "path:type" pairs so two copy trees can be compared by shape. */
function shape(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) {
    return [`${path}:array(${value.length})`, ...value.flatMap((v, i) => shape(v, `${path}[${i}]`))];
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => shape(v, path ? `${path}.${k}` : k));
  }
  return [`${path}:${typeof value}`];
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

describe("copy", () => {
  it("has the same structure in Indonesian and English", () => {
    expect(shape(en)).toEqual(shape(id));
  });

  it("has no empty strings", () => {
    for (const copy of [id, en]) {
      expect(strings(copy).filter((s) => s.trim() === "")).toEqual([]);
    }
  });

  it("keeps the same project and client order in both languages", () => {
    expect(en.products.items.map((p) => p.slug)).toEqual(id.products.items.map((p) => p.slug));
    expect(en.clients.featured.map((c) => c.slug)).toEqual(id.clients.featured.map((c) => c.slug));
  });

  // Buyers don't care about backend vs frontend. Official job titles in the
  // client list may still say "Backend"; the self-description must not.
  it("introduces Adyan as a software engineer, not a backend engineer", () => {
    for (const copy of [id, en]) {
      const { clients: _officialTitles, ...self } = copy;
      expect(strings(self).filter((s) => /backend/i.test(s))).toEqual([]);
      expect(copy.meta.description).toMatch(/software engineer/i);
    }
  });
});

// Laris claims follow its claim register (admos-laris-hub
// business/marketing/_context/Laris_Product_Offerings.md): shipping is not
// published, and "works offline" is only true for cash sales.
describe("laris claims", () => {
  // Same shape as the @muhadyan bot rule me-offline-cash (threads-brand rules.json):
  // a "no network" phrase with a claim word within 40 characters, either side.
  const NET = String.raw`(?:internet|sinyal|jaringan|koneksi|wi-?fi|network|signal)\w*`;
  const NO_NETWORK = new RegExp(
    String.raw`\b(?:offline|${NET}\s+(?:\w+\s+){0,2}(?:is\s+)?(?:mati|hilang|putus|lemot|down|drops?)\b|` +
      String.raw`(?:tanpa|tidak ada|nggak ada|gak ada|no|without)\s+${NET})`,
    "gi",
  );
  const CLAIM = /\b(jalan|tetap|bisa|catat|tercatat|jualan|transaksi|aman|lancar|kasir|works?|keeps?|selling|records?)\b/i;
  const OFFLINE_SHOP = /\b(toko|bisnis|usaha|shop|store)\s+offline|offline\s+(dan|atau|and|or)\s+online/i;

  /** Each 40-character window around a "no network" phrase that makes a claim. */
  function offlineClaims(text: string): string[] {
    return [...text.matchAll(NO_NETWORK)]
      .map((m) => text.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40))
      .filter((w) => CLAIM.test(w) && !OFFLINE_SHOP.test(w));
  }

  function larisTexts(copy: typeof id): string[] {
    const item = copy.products.items.find((p) => p.slug === "admos-laris")!;
    const rows = copy.needs.rows.filter((r) => r.proof === "Admos Laris");
    return [...strings(item), ...rows.map((r) => r.build)];
  }

  it("never publishes shipping features", () => {
    for (const copy of [id, en]) {
      expect(larisTexts(copy).filter((s) => /ongkir|alamat|kurir|shipping|address|courier/i.test(s))).toEqual([]);
    }
  });

  it("says cash whenever it claims Laris works offline", () => {
    for (const copy of [id, en]) {
      const claims = larisTexts(copy).flatMap(offlineClaims);
      expect(claims.length).toBeGreaterThan(0);
      expect(claims.filter((w) => !/tunai|cash/i.test(w))).toEqual([]);
    }
  });

  it("says QRIS needs a network next to the cash-only offline line", () => {
    for (const copy of [id, en]) {
      const summary = larisTexts(copy).find((s) => offlineClaims(s).length > 0)!;
      expect(summary).toMatch(/QRIS (tetap )?(butuh|needs) (jaringan|a connection)/);
    }
  });

  it("finds offline claims in any word order and treats a network limit as a limit", () => {
    for (const claim of [
      "Tetap jalan walau sinyal di venue hilang.",
      "Tetap jalan tanpa internet.",
      "Saat jaringan gedung mati, penjualan tetap jalan.",
      "Internet mati? Kasir tetap jalan.",
      "Works with no signal.",
      "Keeps selling when the network is down.",
    ]) {
      expect(offlineClaims(claim), claim).not.toEqual([]);
    }
    for (const limit of [
      "Layar kedua menghadap pembeli, selama ada jaringan",
      "QRIS butuh jaringan",
      "Jualan di toko offline dan online.",
    ]) {
      expect(offlineClaims(limit), limit).toEqual([]);
    }
  });

  it("does not credit Laris with invoices, returns or low-stock reminders", () => {
    for (const copy of [id, en]) {
      const rows = copy.needs.rows.filter((r) => r.proof === "Admos Laris");
      expect(rows.filter((r) => /faktur|retur|menipis|invoice|return|low-stock/i.test(r.build))).toEqual([]);
    }
  });

  it("states the stock limit whenever it claims Laris tracks stock", () => {
    for (const copy of [id, en]) {
      const claims = larisTexts(copy).filter((s) => /\b(stok|stock)\b/i.test(s));
      expect(claims.length).toBeGreaterThan(0);
      expect(claims.filter((s) => !/tidak pernah menghalangi penjualan|never blocks a sale/i.test(s))).toEqual([]);
    }
  });

  it("says both apps share one Admos account", () => {
    for (const copy of [id, en]) {
      expect(larisTexts(copy).some((s) => /Akun Admos|Admos account/.test(s) && /Accounting/.test(s))).toBe(true);
    }
  });
});

describe("work data", () => {
  const slugs = [...id.products.items.map((p) => p.slug), ...id.clients.featured.map((c) => c.slug)];

  it("has a live https url and a screenshot for every project and client", () => {
    for (const slug of slugs) {
      const work = WORK[slug];
      expect(work, slug).toBeDefined();
      expect(work.url, slug).toMatch(/^https:\/\//);
      expect(work.shots.length, slug).toBeGreaterThan(0);
    }
  });

  it("never names shipping features in Admos screenshot alt text", () => {
    const admos = Object.entries(WORK).filter(([slug]) => slug.startsWith("admos-"));
    const alts = admos.flatMap(([, w]) => w.shots.flatMap((s) => [s.alt.id, s.alt.en]));
    expect(alts.length).toBeGreaterThan(0);
    expect(alts.filter((a) => /ongkir|kurir|pesanan kirim|shipping|courier/i.test(a))).toEqual([]);
  });

  it("gives every screenshot alt text in both languages", () => {
    for (const slug of slugs) {
      for (const shot of WORK[slug].shots) {
        expect(shot.alt.id.trim(), slug).not.toBe("");
        expect(shot.alt.en.trim(), slug).not.toBe("");
      }
    }
  });
});
