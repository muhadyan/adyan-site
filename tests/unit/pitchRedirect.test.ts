import { describe, expect, it } from "vitest";
import { pitchTarget } from "../../src/lib/pitchRedirect";

// Cloudflare's _redirects left ":code" unreplaced in the query string on the live site
// (2026-10-29), so pitch links are answered by a Pages Function that builds the URL here.
describe("pitchTarget", () => {
  it("sends /p/<code> home with the code as utm_content", () => {
    expect(pitchTarget("p", "k7x2")).toBe("/?utm_source=threads&utm_medium=pitch&utm_content=k7x2");
  });

  it("sends a lane code to the lane page", () => {
    expect(pitchTarget("website", "abc123")).toBe("/website/?utm_source=threads&utm_medium=pitch&utm_content=abc123");
    expect(pitchTarget("kasir", "z9")).toBe("/kasir/?utm_source=threads&utm_medium=pitch&utm_content=z9");
  });

  // A link at the end of a sentence can swallow the full stop; the page trims it.
  it("keeps trailing punctuation for the page to trim", () => {
    expect(pitchTarget("pembukuan", "abc.")).toBe("/pembukuan/?utm_source=threads&utm_medium=pitch&utm_content=abc.");
  });

  it("drops a code that is not a pitch code", () => {
    for (const code of ["", ":code", "a b", "<script>", "x".repeat(17), "abc&utm_source=evil"]) {
      expect(pitchTarget("p", code), code).toBe("/?utm_source=threads&utm_medium=pitch");
    }
  });
});
