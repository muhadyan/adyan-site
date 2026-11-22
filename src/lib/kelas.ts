// Sign-up window of the "AI untuk Kerja" class. The site is static, so the page checks the
// deadline twice: at build time (the HTML a visitor without JavaScript gets) and in the browser.

/** True once `now` is past the deadline. An unreadable deadline counts as open. */
export function kelasClosed(now: Date, closesAt: string): boolean {
  const deadline = Date.parse(closesAt);
  return Number.isFinite(deadline) && now.getTime() > deadline;
}
