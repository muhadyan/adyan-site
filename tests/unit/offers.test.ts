import { describe, expect, it } from "vitest";
import { OFFERS, RENEWAL, rupiah } from "../../src/data/offers";

describe("OFFERS", () => {
  // Middle-market "mulai dari" prices, decided 2026-10-29. Maps services must say the same.
  it("keeps the agreed starting prices", () => {
    expect(OFFERS.website.from).toBe(2_500_000);
    expect(OFFERS.kasir.from).toBe(5_000_000);
    expect(OFFERS.pembukuan.from).toBe(10_000_000);
    expect(OFFERS.erp.from).toBe(25_000_000);
    expect(RENEWAL.website).toBe(750_000);
  });
});

describe("rupiah", () => {
  it("writes millions the Indonesian way", () => {
    expect(rupiah(2_500_000, "id")).toBe("Rp2,5 juta");
    expect(rupiah(5_000_000, "id")).toBe("Rp5 juta");
    expect(rupiah(750_000, "id")).toBe("Rp750 ribu");
  });

  it("writes millions the English way", () => {
    expect(rupiah(2_500_000, "en")).toBe("Rp2.5 million");
    expect(rupiah(25_000_000, "en")).toBe("Rp25 million");
    expect(rupiah(750_000, "en")).toBe("Rp750k");
  });

  it("has a short form for tight spots", () => {
    expect(rupiah(2_500_000, "id", true)).toBe("Rp2,5 jt");
    expect(rupiah(10_000_000, "en", true)).toBe("Rp10M");
  });
});
