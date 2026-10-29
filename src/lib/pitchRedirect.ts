// Where a pitch link goes: /p/<code> to home, /<lane>/<code> to that lane page.
// Only a plain code (plus a swallowed full stop or comma) is passed on.
const CODE = /^[A-Za-z0-9]{1,16}[.,!?)]?$/;

export type PitchPath = "p" | "website" | "kasir" | "pembukuan";

export function pitchTarget(path: PitchPath, code: string): string {
  const page = path === "p" ? "/" : `/${path}/`;
  const query = new URLSearchParams({ utm_source: "threads", utm_medium: "pitch" });
  if (CODE.test(code)) query.set("utm_content", code);
  return `${page}?${query}`;
}

/** Pages Function handler for functions/<path>/[code].ts. */
export function pitchRedirect(path: PitchPath) {
  return ({ request, params }: { request: Request; params: Record<string, string | string[]> }): Response => {
    const code = typeof params.code === "string" ? params.code : "";
    return Response.redirect(new URL(pitchTarget(path, code), request.url).toString(), 302);
  };
}
