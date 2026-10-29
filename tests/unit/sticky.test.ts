import { describe, expect, it } from "vitest";
import { stickyVisible } from "../../src/lib/sticky";

// The phone WhatsApp bar shows only while no other WhatsApp button is on screen:
// after the hero button has scrolled up out of view, and until the footer button is reached.
describe("stickyVisible", () => {
  it("hides while the hero button is on screen", () => {
    expect(stickyVisible({ heroVisible: true, heroAbove: false, footerReached: false })).toBe(false);
  });

  it("shows once the hero button has scrolled up out of view", () => {
    expect(stickyVisible({ heroVisible: false, heroAbove: true, footerReached: false })).toBe(true);
  });

  it("hides from the footer button down", () => {
    expect(stickyVisible({ heroVisible: false, heroAbove: true, footerReached: true })).toBe(false);
  });

  // A page opened mid-way (anchor link, restored scroll) below the hero still gets the bar,
  // but a hero button that is still below the screen does not count as passed.
  it("stays hidden when the hero button is below the screen", () => {
    expect(stickyVisible({ heroVisible: false, heroAbove: false, footerReached: false })).toBe(false);
  });
});
