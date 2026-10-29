import { describe, expect, it } from "vitest";
import { HERO_SHOTS, LANE_SHOTS, lanePath } from "../../src/data/lanes";
import { findShot } from "../../src/data/work";

describe("lane screenshots", () => {
  // Each lane shows its own real product on a phone: the shop, the till, the books.
  it("gives every lane two phone screenshots that exist", () => {
    for (const [lane, files] of Object.entries(LANE_SHOTS)) {
      expect(files, lane).toHaveLength(2);
      for (const file of files) expect(findShot(file)?.phone, `${lane}: ${file}`).toBe(true);
    }
  });

  it("shows the shop and the till in the home hero", () => {
    expect(HERO_SHOTS.phones.map((f) => findShot(f)?.phone)).toEqual([true, true]);
    expect(findShot(HERO_SHOTS.wide)?.phone).toBeUndefined();
  });
});

describe("lanePath", () => {
  it("puts Indonesian lanes at the root and English under /en/", () => {
    expect(lanePath("website", "id")).toBe("/website/");
    expect(lanePath("kasir", "en")).toBe("/en/kasir/");
  });
});
