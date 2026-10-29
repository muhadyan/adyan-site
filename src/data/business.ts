import { SITE } from "../config";
import { OFFERS } from "./offers";

/**
 * The Google Maps (Business Profile) listing. Name, address and phone must match
 * the listing exactly: Google trusts a listing more when the website says the same.
 */
export const BUSINESS = {
  name: "Admos ERP",
  // Stays the Maps number until the listing is verified. WhatsApp buttons use SITE.whatsapp.
  phone: "6285717913273",
  phoneDisplay: "0857-1791-3273",
  address: {
    street: "Jl. Beringin Raya No. 1B, Denokan, Maguwoharjo",
    district: "Depok",
    locality: "Kabupaten Sleman",
    region: "DI Yogyakarta",
    postalCode: "55281",
  },
  geo: { lat: -7.7530875, lng: 110.4292598 },
  hours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "17:00",
  },
  areaServed: [
    "Kota Yogyakarta",
    "Kabupaten Sleman",
    "Kabupaten Bantul",
    "Kabupaten Kulon Progo",
    "Kabupaten Gunungkidul",
    "Kabupaten Klaten",
    "Kabupaten Magelang",
    "Kota Surakarta",
  ],
} as const;

/** One-line address for the footer and the map search. */
export function addressLine(): string {
  const { street, district, locality, region, postalCode } = BUSINESS.address;
  return `${street}, Kec. ${district}, ${locality}, ${region} ${postalCode}`;
}

/** Keyless Google Maps embed with a pin on the business coordinates. */
export function mapEmbedUrl(): string {
  const params = new URLSearchParams({ q: `${BUSINESS.geo.lat},${BUSINESS.geo.lng}`, z: "16", output: "embed" });
  return `https://www.google.com/maps?${params}`;
}

/** Structured data for search engines. "<" is escaped so no value can close the script tag. */
export function siteJsonLd(): string {
  const personId = `${SITE.url}/#person`;
  const { address, geo, hours } = BUSINESS;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: SITE.name,
        url: SITE.url,
        jobTitle: "Software Engineer",
        email: `mailto:${SITE.email}`,
        address: { "@type": "PostalAddress", addressLocality: "Yogyakarta", addressCountry: "ID" },
        sameAs: [SITE.github, SITE.linkedin],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE.url}/#business`,
        name: BUSINESS.name,
        url: SITE.url,
        image: `${SITE.url}/og-id.png`,
        telephone: `+${BUSINESS.phone}`,
        email: `mailto:${SITE.email}`,
        founder: { "@id": personId },
        address: {
          "@type": "PostalAddress",
          streetAddress: address.street,
          addressLocality: address.locality,
          addressRegion: address.region,
          postalCode: address.postalCode,
          addressCountry: "ID",
        },
        geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng },
        openingHoursSpecification: [
          { "@type": "OpeningHoursSpecification", dayOfWeek: hours.days, opens: hours.opens, closes: hours.closes },
        ],
        areaServed: BUSINESS.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Layanan Admos ERP",
          itemListElement: Object.values(OFFERS).map((offer) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: offer.name.id },
            priceSpecification: { "@type": "PriceSpecification", minPrice: offer.from, priceCurrency: "IDR" },
          })),
        },
      },
    ],
  }).replace(/</g, "\\u003c");
}
