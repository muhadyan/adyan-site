export type StickyState = { heroVisible: boolean; heroAbove: boolean; footerReached: boolean };

/** The bar never shows next to another WhatsApp button. */
export function stickyVisible({ heroVisible, heroAbove, footerReached }: StickyState): boolean {
  return !heroVisible && heroAbove && !footerReached;
}
