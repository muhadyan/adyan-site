import type { ImageMetadata } from "astro";
import type { Locale } from "../content/types";

/** `phone` marks a portrait mobile capture, shown in a phone frame. */
export type Shot = { image: ImageMetadata; alt: Record<Locale, string>; phone?: boolean };
export type Work = { url: string; shots: Shot[] };

// Every screenshot in src/assets/work. Optional shots (for example the Laris
// camera-scan capture) appear on the page as soon as the file is dropped in.
const files = import.meta.glob<{ default: ImageMetadata }>("../assets/work/*.{png,jpg,jpeg,webp}", {
  eager: true,
});

function find(name: string): ImageMetadata | undefined {
  const key = Object.keys(files).find((path) => path.split("/").pop()?.replace(/\.\w+$/, "") === name);
  return key ? files[key]?.default : undefined;
}

type ShotSpec = { file: string; alt: Record<Locale, string>; phone?: boolean };

/** Resolves shot specs to images, skipping files that are not there yet. */
function shots(specs: ShotSpec[]): Shot[] {
  return specs.flatMap(({ file, alt, phone }) => {
    const image = find(file);
    return image ? [{ image, alt, ...(phone ? { phone } : {}) }] : [];
  });
}

export const WORK: Record<string, Work> = {
  "admos-accounting": {
    url: "https://accounting.admos.id",
    shots: shots([
      {
        file: "admos-dashboard",
        alt: {
          id: "Dasbor Admos Accounting: pendapatan, pengeluaran, dan laba bersih bulan ini dengan grafik 6 bulan",
          en: "Admos Accounting dashboard: this month's income, expenses and net profit with a 6-month chart",
        },
      },
      {
        file: "admos-laba-rugi",
        alt: {
          id: "Laporan laba rugi Admos Accounting yang tersusun otomatis dari jurnal",
          en: "Admos Accounting profit and loss report built automatically from the journal",
        },
      },
      {
        file: "admos-jurnal",
        alt: { id: "Daftar jurnal umum di Admos Accounting", en: "General journal list in Admos Accounting" },
      },
    ]),
  },
  "admos-laris": {
    url: "https://laris.admos.id",
    shots: shots([
      {
        file: "admos-laris",
        alt: {
          id: "Halaman depan Admos Laris dengan contoh label QR produk fashion",
          en: "Admos Laris home page with sample QR labels for fashion products",
        },
      },
      {
        file: "laris-scan",
        phone: true,
        alt: {
          id: "Scan label QR produk pakai kamera HP di Admos Laris",
          en: "Scanning a product QR label with a phone camera in Admos Laris",
        },
      },
      {
        file: "laris-kasir-mobile",
        phone: true,
        alt: {
          id: "Layar kasir Admos Laris di HP dengan keranjang berisi 5 barang batik",
          en: "Admos Laris till on a phone with 5 batik items in the cart",
        },
      },
      {
        file: "laris-saldo",
        alt: {
          id: "Saldo dan buku besar transaksi di Admos Laris",
          en: "Balance and transaction ledger in Admos Laris",
        },
      },
    ]),
  },
  ringkasaja: {
    url: "https://ringkasaja.com",
    shots: shots([
      {
        file: "ringkasaja-orders",
        alt: { id: "Daftar order di RingkasAja dengan status tiap paket", en: "RingkasAja order list with each parcel's status" },
      },
      {
        file: "ringkasaja-new-order",
        alt: {
          id: "Buat pesanan di RingkasAja dengan menempel chat orderan dari pembeli",
          en: "Creating a RingkasAja order by pasting the buyer's chat message",
        },
      },
      {
        file: "ringkasaja-order-detail",
        alt: {
          id: "Detail order RingkasAja: barang, ongkir, alamat yang sudah dirapikan, dan nomor resi",
          en: "RingkasAja order detail: items, shipping, the tidied address and waybill number",
        },
      },
      {
        file: "ringkasaja",
        alt: {
          id: "Halaman depan RingkasAja: dari chat ke resi dalam 30 detik",
          en: "RingkasAja home page: from chat to waybill in 30 seconds",
        },
      },
    ]),
  },
  "search-array": {
    url: "https://search-array.com",
    shots: shots([
      {
        file: "search-array",
        alt: { id: "Halaman masuk Search Array", en: "Search Array sign-in page" },
      },
    ]),
  },
  tokopedia: {
    url: "https://www.tokopedia.com/discovery/deals",
    shots: shots([
      {
        file: "tokopedia-promo",
        alt: { id: "Halaman promo Tokopedia", en: "Tokopedia promotions page" },
      },
    ]),
  },
  katalis: {
    url: "https://katalis.ai",
    shots: shots([
      { file: "katalis", alt: { id: "Halaman depan Katalis AI", en: "Katalis AI home page" } },
    ]),
  },
  wateriq: {
    url: "https://wateriq.solarchapter.com",
    shots: shots([
      {
        file: "wateriq",
        alt: {
          id: "Halaman depan WaterIQ, pemantauan air bersih berbasis IoT",
          en: "WaterIQ home page, IoT clean-water monitoring",
        },
      },
    ]),
  },
};
