import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Short tag links posted on Threads. Each lands on the home page with UTM tags
// so the tracker can tell which Threads source sent the visit.
const rules = readFileSync(new URL("../../public/_redirects", import.meta.url), "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"))
  .map((line) => line.split(/\s+/));

const TAGS = [
  { path: "/p", medium: "pitch" },
  { path: "/b", medium: "bio" },
];

describe("_redirects", () => {
  for (const tag of TAGS) {
    // "/p." covers a link that swallows the full stop after it.
    for (const from of [tag.path, `${tag.path}.`]) {
      it(`sends ${from} home with utm_medium=${tag.medium}`, () => {
        expect(rules).toContainEqual([from, `/?utm_source=threads&utm_medium=${tag.medium}`, "302"]);
      });
    }
  }

  // Pitch codes are handled by Pages Functions; a _redirects rule would shadow them.
  it("leaves /p/<code> and /<lane>/<code> to the Pages Functions", () => {
    expect(rules.filter(([from]) => from!.includes(":code"))).toEqual([]);
    for (const path of ["p", "website", "kasir", "pembukuan"]) {
      expect(existsSync(new URL(`../../functions/${path}/[code].ts`, import.meta.url)), path).toBe(true);
    }
  });
});
