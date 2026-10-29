import { pitchRedirect } from "../../src/lib/pitchRedirect";

// HEAD too: link checkers (Meta, Threads) probe with it before showing a preview.
export const onRequestGet = pitchRedirect("p");
export const onRequestHead = onRequestGet;
