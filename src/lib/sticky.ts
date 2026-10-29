export type StickyState = { heroVisible: boolean; heroAbove: boolean; footerVisible: boolean };

/** The bar never shows next to another WhatsApp button. */
export function stickyVisible({ heroVisible, heroAbove, footerVisible }: StickyState): boolean {
  return !heroVisible && heroAbove && !footerVisible;
}
