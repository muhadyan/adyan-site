// A pitch link (/p/<code>) lands with utm_medium=pitch&utm_content=<code>. The tracker tags only
// that first page, so the code is kept for the visit and added to every tracked click: a WhatsApp
// click on a later page still tells which pitch brought the visitor.

const KEY = "pitch-code";
const CODE = /^[a-z0-9]{1,16}$/;

export function pitchCodeFrom(search: string): string {
  const q = new URLSearchParams(search);
  if (q.get("utm_medium") !== "pitch") return "";
  const code = (q.get("utm_content") ?? "").toLowerCase().replace(/[.,!?)]+$/, "");
  return CODE.test(code) ? code : "";
}

export function rememberPitchCode(search: string, store: Storage | null): string {
  const code = pitchCodeFrom(search);
  try {
    if (code) store?.setItem(KEY, code);
    const kept = code || (store?.getItem(KEY) ?? "");
    return CODE.test(kept) ? kept : "";
  } catch {
    return code;
  }
}

export function tagClicks(root: ParentNode, code: string): void {
  if (!code) return;
  for (const el of root.querySelectorAll("[data-umami-event]")) {
    el.setAttribute("data-umami-event-code", code);
  }
}
