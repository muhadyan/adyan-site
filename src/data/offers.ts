import type { Locale } from "../content/types";

/**
 * "Mulai dari" (starting) prices, decided 2026-10-29. One source for the page,
 * the JSON-LD and the Maps services list, so they never disagree.
 * Prices go on the site, Maps, bio and ads only, never in pitch messages.
 * After a change: run `bun run og` (the link-preview PNGs show these prices) and update the Maps services.
 */
export const OFFERS = {
  website: { from: 2_500_000, name: { id: "Website usaha", en: "Business website" } },
  kasir: { from: 5_000_000, name: { id: "Sistem kasir & stok", en: "POS & stock system" } },
  pembukuan: { from: 10_000_000, name: { id: "Sistem pembukuan", en: "Bookkeeping system" } },
  erp: { from: 25_000_000, name: { id: "ERP Finance, HR & GA", en: "Finance, HR & GA ERP" } },
} as const;

export type OfferKey = keyof typeof OFFERS;

/** Yearly fee from year 2: domain + hosting + SSL. */
export const RENEWAL = { website: 750_000 } as const;

const UNITS = {
  id: { million: [" juta", " jt"], thousand: [" ribu", "rb"], decimal: "," },
  en: { million: [" million", "M"], thousand: ["k", "k"], decimal: "." },
} as const;

/** "Rp2,5 juta" / "Rp2.5 million"; `short` gives "Rp2,5 jt" / "Rp2.5M". */
export function rupiah(amount: number, locale: Locale, short = false): string {
  const unit = UNITS[locale];
  const [value, words] = amount >= 1_000_000 ? [amount / 1_000_000, unit.million] : [amount / 1_000, unit.thousand];
  const number = String(Math.round(value * 10) / 10).replace(".", unit.decimal);
  return `Rp${number}${words[short ? 1 : 0]}`;
}
