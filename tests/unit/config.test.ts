import { describe, expect, it } from "vitest";
import { SITE, waLink } from "../../src/config";

describe("waLink", () => {
  it("builds a wa.me link with the encoded message", () => {
    expect(waLink("Halo kak, mau tanya sistem stok & kasir?")).toBe(
      "https://wa.me/6285717913273?text=Halo%20kak%2C%20mau%20tanya%20sistem%20stok%20%26%20kasir%3F",
    );
  });

  it("omits the text param when the message is empty", () => {
    expect(waLink("")).toBe("https://wa.me/6285717913273");
  });
});

describe("SITE", () => {
  it("uses an international WhatsApp number with digits only", () => {
    expect(SITE.whatsapp).toMatch(/^62\d{8,13}$/);
  });

  it("links only to https profiles", () => {
    for (const url of [SITE.github, SITE.linkedin, SITE.url]) {
      expect(url).toMatch(/^https:\/\//);
    }
  });
});
