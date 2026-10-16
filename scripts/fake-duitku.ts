// A stand-in for the Duitku API, for the LOCAL Laris stack only, so demo QRIS
// sales can reach Saldo without a sandbox account. It answers the three calls the
// Laris API makes, then posts a signed "paid" callback a moment after each QR.
// Usage: FAKE_DUITKU_MERCHANT=.. FAKE_DUITKU_KEY=.. bun scripts/fake-duitku.ts
// Started by scripts/demo-stack.sh; listens on 127.0.0.1 only.
import { createHmac } from "node:crypto";

const PORT = Number(process.env.FAKE_DUITKU_PORT ?? 18099);
const MERCHANT = process.env.FAKE_DUITKU_MERCHANT ?? "";
const KEY = process.env.FAKE_DUITKU_KEY ?? "";
const PAID_AFTER_MS = 1500;
if (!MERCHANT || !KEY) throw new Error("FAKE_DUITKU_MERCHANT and FAKE_DUITKU_KEY are required");

const sign = (text: string) => createHmac("sha256", KEY).update(text).digest("hex");
const json = (body: unknown) => Response.json(body);

function isLocal(raw: string): boolean {
  try {
    const host = new URL(raw).hostname;
    return host === "127.0.0.1" || host === "localhost" || host.endsWith(".localhost");
  } catch {
    return false;
  }
}

async function payLater(callbackUrl: string, orderId: string, amount: string, reference: string) {
  if (!isLocal(callbackUrl)) return console.warn(`refusing a non-local callback ${callbackUrl}`);
  await Bun.sleep(PAID_AFTER_MS);
  const form = new URLSearchParams({
    merchantCode: MERCHANT,
    amount,
    merchantOrderId: orderId,
    resultCode: "00",
    reference,
    paymentCode: "SP",
    signature: sign(MERCHANT + amount + orderId),
  });
  const res = await fetch(callbackUrl, { method: "POST", body: form });
  console.log(`callback ${orderId} Rp ${amount}: HTTP ${res.status}`);
}

const references = new Map<string, { reference: string; amount: string }>();

Bun.serve({
  hostname: "127.0.0.1",
  port: PORT,
  async fetch(req) {
    const path = new URL(req.url).pathname;
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    if (path.endsWith("/paymentmethod/getpaymentmethod")) {
      return json({
        responseCode: "00",
        responseMessage: "SUCCESS",
        paymentFee: [{ paymentMethod: "SP", paymentName: "QRIS", paymentImage: "", totalFee: "0" }],
      });
    }
    if (path.endsWith("/v2/inquiry")) {
      const orderId = String(body.merchantOrderId ?? "");
      const amount = String(body.paymentAmount ?? "0");
      const reference = `DEMO${Date.now()}`;
      references.set(orderId, { reference, amount });
      void payLater(String(body.callbackUrl ?? ""), orderId, amount, reference);
      return json({
        merchantCode: MERCHANT,
        reference,
        paymentUrl: "",
        vaNumber: "",
        qrString: `00020101021226670016ID.CO.DEMO.WWW0118${reference}5204581253033605802ID5911TOKO DEMO6009YOGYAKARTA6304ABCD`,
        amount,
        statusCode: "00",
        statusMessage: "SUCCESS",
      });
    }
    if (path.endsWith("/transactionStatus")) {
      const orderId = String(body.merchantOrderId ?? "");
      const known = references.get(orderId);
      return json({
        merchantOrderId: orderId,
        reference: known?.reference ?? "",
        amount: known?.amount ?? "0",
        fee: "0",
        statusCode: known ? "00" : "02",
        statusMessage: known ? "SUCCESS" : "FAILED",
      });
    }
    return new Response("not found", { status: 404 });
  },
});
console.log(`fake Duitku on http://127.0.0.1:${PORT}`);
