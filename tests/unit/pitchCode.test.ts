import { describe, expect, it } from "vitest";
import { pitchCodeFrom, rememberPitchCode, tagClicks } from "../../src/lib/pitchCode";

function memStore(): Storage {
  const m = new Map<string, string>();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => void m.set(k, String(v)),
    removeItem: (k) => void m.delete(k),
    clear: () => m.clear(),
    key: (i) => [...m.keys()][i] ?? null,
    get length() {
      return m.size;
    },
  };
}

describe("pitchCodeFrom", () => {
  it("reads the code of a pitch link", () => {
    expect(pitchCodeFrom("?utm_source=threads&utm_medium=pitch&utm_content=k7x2ab")).toBe("k7x2ab");
  });

  it("drops a swallowed full stop and lowercases", () => {
    expect(pitchCodeFrom("?utm_medium=pitch&utm_content=K7X2AB.")).toBe("k7x2ab");
  });

  it("ignores other sources and junk", () => {
    expect(pitchCodeFrom("?utm_medium=bio&utm_content=k7x2ab")).toBe("");
    expect(pitchCodeFrom("?utm_medium=pitch&utm_content=<script>")).toBe("");
    expect(pitchCodeFrom("")).toBe("");
  });
});

describe("rememberPitchCode", () => {
  it("keeps the landing code for later pages of the visit", () => {
    const s = memStore();
    expect(rememberPitchCode("?utm_medium=pitch&utm_content=abc234", s)).toBe("abc234");
    expect(rememberPitchCode("", s)).toBe("abc234");
  });

  it("ignores a stored value that is not a code", () => {
    const s = memStore();
    s.setItem("pitch-code", '"><img src=x>');
    expect(rememberPitchCode("", s)).toBe("");
  });

  it("works without storage", () => {
    expect(rememberPitchCode("?utm_medium=pitch&utm_content=abc234", null)).toBe("abc234");
    expect(rememberPitchCode("", null)).toBe("");
  });
});

describe("tagClicks", () => {
  it("adds the code to every tracked element", () => {
    const attrs: Record<string, string>[] = [{}, {}];
    const els = attrs.map((a) => ({ setAttribute: (k: string, v: string) => void (a[k] = v) }));
    tagClicks({ querySelectorAll: () => els } as unknown as ParentNode, "abc234");
    expect(attrs).toEqual([{ "data-umami-event-code": "abc234" }, { "data-umami-event-code": "abc234" }]);
  });

  it("does nothing without a code", () => {
    let called = false;
    tagClicks({ querySelectorAll: () => ((called = true), []) } as unknown as ParentNode, "");
    expect(called).toBe(false);
  });
});
