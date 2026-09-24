export type Locale = "id" | "en";

export type Figure = { value: string; label: string };

export type Copy = {
  meta: { title: string; description: string };
  nav: { skip: string; langLabel: string; contact: string };
  wa: { message: string };
  hero: {
    title: string;
    lede: string;
    proof: string;
    cta: string;
    ctaNote: string;
    receipt: {
      heading: string;
      number: string;
      to: string;
      lines: string[];
      totalLabel: string;
      total: string;
      stamp: string;
      thanks: string;
    };
  };
  needs: {
    title: string;
    intro: string;
    columns: { need: string; build: string; proof: string };
    rows: { need: string; build: string; proof: string }[];
  };
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
  why: { title: string; story: string[]; figures: Figure[]; photoAlt: string };
  process: { title: string; steps: { title: string; body: string }[] };
  faq: { title: string; items: { q: string; a: string }[] };
  footer: { title: string; body: string; cta: string; email: string; cv: string; github: string; linkedin: string };
};
