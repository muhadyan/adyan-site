import type { LaneSlug, Locale } from "../content/types";

/** Phone screenshots per lane (files in src/assets/work): the real product for that lane. */
export const LANE_SHOTS: Record<LaneSlug, [string, string]> = {
  website: ["ummu-alfatih-produk-mobile", "ummu-alfatih-mobile"],
  kasir: ["laris-kasir-mobile", "laris-hari-ini-mobile"],
  pembukuan: ["admos-dashboard-mobile", "admos-foto-nota-mobile"],
};

/** Home hero: the shop and the till. `wide` is the desktop shot behind the phone on large screens. */
export const HERO_SHOTS = { wide: "ummu-alfatih", phones: ["ummu-alfatih-produk-mobile", "laris-kasir-mobile"] } as const;

export function homePath(locale: Locale): string {
  return locale === "id" ? "/" : "/en/";
}

export function lanePath(slug: LaneSlug, locale: Locale): string {
  return `${homePath(locale)}${slug}/`;
}
