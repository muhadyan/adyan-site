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

  it("gives every screenshot alt text in both languages", () => {
    for (const slug of slugs) {
      for (const shot of WORK[slug].shots) {
        expect(shot.alt.id.trim(), slug).not.toBe("");
        expect(shot.alt.en.trim(), slug).not.toBe("");
      }
    }
  });
});
