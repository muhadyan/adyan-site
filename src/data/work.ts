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
          id: "Beranda Admos Accounting: untung bulan ini, pendapatan, pengeluaran, dan uang di kas dan bank, lalu grafik 6 bulan",
          en: "Admos Accounting Beranda (home): this month's profit, income, expenses and cash on hand, then a 6-month chart",
        },
      },
      {
        file: "admos-dashboard-mobile",
        phone: true,
        alt: {
          id: "Beranda Admos Accounting di HP: untung bulan ini, tombol Catat dari Foto, dan menu bawah Beranda, Catat, Penjualan, Laporan",
          en: "Admos Accounting Beranda on a phone: this month's profit, the Catat dari Foto button, and the bottom bar with Beranda, Catat, Penjualan and Laporan",
        },
      },
      {
        file: "admos-foto-nota-mobile",
        phone: true,
        alt: {
          id: "Catat dari Foto di HP: nota toko kain jadi draf kas keluar Rp 1.151.000, debit dan kredit seimbang, siap disimpan",
          en: "Catat dari Foto on a phone: a fabric-shop receipt becomes a cash-out draft of Rp 1,151,000, debit and credit balanced, ready to save",
        },
      },
      {
        file: "admos-laba-rugi",
        alt: {
          id: "Laporan Untung Rugi Admos Accounting dalam kata sehari-hari: uang dari penjualan, modal barang, biaya usaha, dan untung bersih",
          en: "Admos Accounting Untung Rugi (profit and loss) report in plain words: sales, cost of goods, operating costs and net profit",
        },
      },
      {
        file: "admos-jurnal",
        alt: {
          id: "Jurnal umum di menu Untuk akuntan, dengan penjualan dan biaya dari Laris yang tercatat otomatis",
          en: "General journal under the Untuk akuntan (for accountants) menu, with Laris sales and fees recorded automatically",
        },
      },
    ]),
  },
  "admos-laris": {
    url: "https://laris.admos.id",
    shots: shots([
      {
        file: "admos-laris",
        alt: {
          id: "Halaman depan Admos Laris dengan contoh kasir dan label QR produk fashion",
          en: "Admos Laris home page with a sample till and QR label for fashion products",
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
        file: "laris-hari-ini-mobile",
        phone: true,
        alt: {
          id: "Layar Hari ini di Admos Laris: penjualan hari ini Rp 3.720.000 dari 8 pesanan, tunai dan QRIS, lalu menu bawah Hari ini, Kasir, Pesanan, Produk, Lainnya",
          en: "Admos Laris Hari ini (Today) screen: Rp 3,720,000 from 8 orders today, cash and QRIS, then the bottom bar Hari ini, Kasir, Pesanan, Produk, Lainnya",
        },
      },
      {
        file: "laris-kasir-mobile",
        phone: true,
        alt: {
          id: "Kasir Admos Laris di HP dengan harga pameran dan keranjang berisi 4 barang batik",
          en: "Admos Laris till on a phone with exhibition prices and 4 batik items in the cart",
        },
      },
      {
        file: "laris-saldo",
        alt: {
          id: "Saldo Admos Laris: uang yang bisa dicairkan sekarang, yang masih menunggu, dan riwayat saldo",
          en: "Admos Laris balance: money to withdraw now, money still settling, and the balance history",
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
        file: "ringkasaja-orders-mobile",
        phone: true,
        alt: {
          id: "Daftar order RingkasAja di HP: status Siap Kirim, Menunggu Bayar, dan Selesai",
          en: "RingkasAja order list on a phone: Ready to Ship, Awaiting Payment and Done statuses",
        },
      },
      {
        file: "ringkasaja-order-detail-mobile",
        phone: true,
        alt: {
          id: "Detail order RingkasAja di HP: barang, ongkir, total, dan nomor resi",
          en: "RingkasAja order detail on a phone: items, shipping, total and waybill number",
        },
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
  "ummu-alfatih": {
    url: "https://ummualfatih.id",
    shots: shots([
      {
        file: "ummu-alfatih",
        alt: {
          id: "Katalog toko online Ummu Alfatih: outer, khiban, dan khimar dengan harga diskon",
          en: "Ummu Alfatih online shop catalogue: outerwear, khiban and khimar at sale prices",
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
