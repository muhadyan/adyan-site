import { describe, expect, it } from "vitest";
import { SITE } from "../../src/config";
import { BUSINESS, mapEmbedUrl, siteJsonLd } from "../../src/data/business";

type Node = Record<string, unknown>;

function graph(): Node[] {
  return JSON.parse(siteJsonLd())["@graph"];
}

function node(type: string): Node {
  const found = graph().find((n) => n["@type"] === type);
  if (!found) throw new Error(`no ${type} node`);
  return found;
}

describe("BUSINESS", () => {
  // Google Maps ranks a listing higher when name, address and phone match the website.
  it("uses the exact Google Maps listing name", () => {
    expect(BUSINESS.name).toBe("Admos ERP");
  });

  it("has a full Sleman street address with a 5-digit postcode", () => {
    expect(BUSINESS.address.street).toMatch(/^Jl\. /);
    expect(BUSINESS.address.region).toBe("DI Yogyakarta");
    expect(BUSINESS.address.postalCode).toMatch(/^\d{5}$/);
  });

  it("has coordinates inside the Yogyakarta area", () => {
    expect(BUSINESS.geo.lat).toBeGreaterThan(-8.3);
    expect(BUSINESS.geo.lat).toBeLessThan(-7.4);
    expect(BUSINESS.geo.lng).toBeGreaterThan(110);
    expect(BUSINESS.geo.lng).toBeLessThan(110.9);
  });

  it("shows the WhatsApp number as a local phone number", () => {
    expect(BUSINESS.phoneDisplay.replace(/\D/g, "")).toBe(`0${SITE.whatsapp.slice(2)}`);
  });
});

describe("siteJsonLd", () => {
  it("keeps the Person node unchanged", () => {
    const person = node("Person");
    expect(person.name).toBe(SITE.name);
    expect(person.jobTitle).toBe("Software Engineer");
    expect(person["@id"]).toBe(`${SITE.url}/#person`);
  });

  it("adds a ProfessionalService node that matches the Maps listing", () => {
    const biz = node("ProfessionalService");
    expect(biz.name).toBe("Admos ERP");
    expect(biz.telephone).toBe(`+${SITE.whatsapp}`);
    expect(biz.founder).toEqual({ "@id": `${SITE.url}/#person` });
    expect(biz.address).toMatchObject({
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.locality,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: "ID",
    });
    expect(biz.geo).toMatchObject({ "@type": "GeoCoordinates", latitude: BUSINESS.geo.lat });
  });

  it("lists Mon–Sat 09:00–17:00 opening hours", () => {
    const [hours] = node("ProfessionalService").openingHoursSpecification as Node[];
    expect(hours.dayOfWeek).toEqual(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
    expect(hours.opens).toBe("09:00");
    expect(hours.closes).toBe("17:00");
  });

  it("serves the 8 areas from the Maps listing", () => {
    const areas = node("ProfessionalService").areaServed as Node[];
    expect(areas).toHaveLength(8);
    expect(areas.map((a) => a.name)).toContain("Kabupaten Sleman");
  });

  it("escapes '<' so no value can close the script tag", () => {
    expect(siteJsonLd()).not.toContain("<");
  });
});

describe("mapEmbedUrl", () => {
  // Until the Maps listing is verified Google can't find "Admos ERP" by name,
  // so the embed pins the coordinates to always show a marker.
  it("builds a keyless Google Maps embed pinned on the business coordinates", () => {
    const url = new URL(mapEmbedUrl());
    expect(url.origin).toBe("https://www.google.com");
    expect(url.searchParams.get("output")).toBe("embed");
    expect(url.searchParams.get("q")).toBe(`${BUSINESS.geo.lat},${BUSINESS.geo.lng}`);
  });
});
