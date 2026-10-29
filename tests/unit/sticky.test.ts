import { describe, expect, it } from "vitest";
import { stickyVisible } from "../../src/lib/sticky";

// The phone WhatsApp bar shows only while no other WhatsApp button is on screen:
// after the hero button has scrolled up out of view, and before the footer button shows.
describe("stickyVisible", () => {
  it("hides while the hero button is on screen", () => {
    expect(stickyVisible({ heroVisible: true, heroAbove: false, footerVisible: false })).toBe(false);
  });

  it("shows once the hero button has scrolled up out of view", () => {
    expect(stickyVisible({ heroVisible: false, heroAbove: true, footerVisible: false })).toBe(true);
  });

  it("hides when the footer button comes into view", () => {
    expect(stickyVisible({ heroVisible: false, heroAbove: true, footerVisible: true })).toBe(false);
  });

  // A page opened mid-way (anchor link, restored scroll) below the hero still gets the bar,
  // but a hero button that is still below the screen does not count as passed.
  it("stays hidden when the hero button is below the screen", () => {
    expect(stickyVisible({ heroVisible: false, heroAbove: false, footerVisible: false })).toBe(false);
  });
});
