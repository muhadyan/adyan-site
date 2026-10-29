import type { OfferKey } from "../data/offers";

export type Locale = "id" | "en";

export type Figure = { value: string; label: string };

export type Faq = { q: string; a: string };

/** A service lane with its own page: /website/, /kasir/, /pembukuan/. */
export type LaneSlug = "website" | "kasir" | "pembukuan";

/** One "Yang kamu dapat" card. The price comes from OFFERS[offer]. */
export type Package = { offer: OfferKey; title: string; lines: string[]; notes: string[] };

export type Lane = {
  slug: LaneSlug;
  meta: { title: string; description: string };
  /** Prefilled WhatsApp message for this lane. */
  wa: string;
  /** The lane's card on the home page and under "Layanan lain". */
  card: { title: string; body: string; cta: string };
  hero: { title: string; lede: string; scope: string; ctaNote: string };
  packages: Package[];
  problems: { need: string; fix: string; proof: string }[];
  faq: Faq[];
};

export type Copy = {
  meta: { title: string; description: string };
  nav: { skip: string; langLabel: string; contact: string };
  wa: { message: string };
  hero: {
    title: string;
    /** "Website mulai **Rp2,5 juta**." One item per sentence, price in bold. */
    lede: { text: string; price: string }[];
    cta: string;
    ctaNote: string;
    chip: string;
    reply: string;
    hours: string;
    shotsCaption: string;
  };
  lanes: {
    title: string;
    other: string;
    from: string;
    items: Lane[];
  };
  price: {
    heading: string;
    from: string;
    final: string;
    finalShort: string;
    allTitle: string;
    all: string[];
    problemsTitle: string;
    faqTitle: string;
  };
  proof: Figure[];
  products: {
    title: string;
    intro: string;
    visit: string;
    statusLabel: string;
    stackLabel: string;
    items: {
      slug: string;
      name: string;
      tagline: string;
      summary: string;
      points: string[];
      status: string;
      stack: string[];
    }[];
  };
  showcase: {
    title: string;
    body: string;
    visit: string;
    testimonial: { approved: boolean; quote: string; by: string };
    workedAt: string;
  };
  clients: {
    title: string;
    intro: string;
    visit: string;
    featured: {
      slug: string;
      name: string;
      role: string;
      period: string;
      summary: string;
      figures: Figure[];
    }[];
    othersTitle: string;
    others: { name: string; note: string }[];
  };
  why: { title: string; story: string[]; photoAlt: string };
  process: { title: string; steps: { title: string; body: string; tag: string }[] };
  faq: { title: string; items: Faq[] };
  footer: {
    title: string;
    cta: string;
    email: string;
    visit: string;
    hours: string;
    map: string;
    cv: string;
    github: string;
    linkedin: string;
  };
};
