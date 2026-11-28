// Copy of the "AI untuk Kerja" class page (/kelas), Indonesian only.
// Text comes from Cue as written: change it only with a copy update from Cue.
import { SITE, waLink } from "../config";
import type { RichFaq } from "./types";

export const kelas = {
  meta: {
    title: "AI untuk Kerja · Kelas gratis 12 Des",
    description: "Kelas praktik 2 jam untuk orang non-IT.",
  },
  hero: {
    title: "AI untuk Kerja",
    subtitle: "Kelas praktik 2 jam untuk orang non-IT.",
    chips: ["Gratis", "10 kursi", "Sabtu, 12 Des 2026", "09.30-11.30 WIB", "Zoom"],
  },
  apply: {
    cta: "Daftar (5 menit)",
    closeNote: "Pendaftaran tutup Selasa, 8 Des 2026, 23.59 WIB.",
    closed: "Pendaftaran sudah ditutup",
  },
  audience: {
    title: "Untuk siapa",
    body: "Usia 20-30. Pemilik usaha, atau kerja di finance, accounting, HR, GA dan admin. Non-IT. Sudah langganan, atau siap langganan sebelum kelas, ChatGPT Plus atau Claude Pro. Bawa laptop.",
  },
  notFor: {
    title: "Bukan untuk",
    body: "Programmer, mahasiswa IT, dan yang mencari teori AI. Kelas khusus untuk teman IT menyusul.",
  },
  work: {
    title: "Yang kamu kerjakan",
    body: "Apa, kenapa, siapa, kapan, di mana dan bagaimana memakai AI di kerjaan (5W1H). Lalu praktik: rekap pengeluaran berantakan jadi laporan per kategori, catatan rapat jadi memo dan to-do, dan satu tugas dari kerjaanmu sendiri.",
  },
  takeaway: {
    title: "Yang kamu bawa pulang",
    body: "Hasil kerja dari 3 tugas tadi, contekan prompt, dan grup alumni untuk tanya-tanya.",
  },
  trainer: {
    title: "Trainer",
    name: "Adyan Rohutomo.",
    body: "5+ tahun di Finance, terakhir pimpin Finance, HR dan GA. Sekarang senior engineer (ex Tokopedia) yang memakai AI tiap hari.",
  },
  steps: {
    title: "Cara daftar",
    items: [
      "Isi form (5 menit).",
      "Aku pilih peserta pada Rabu 9 Des.",
      "Konfirmasi sebelum Kamis 10 Des jam 12.00 dan masuk grup WhatsApp.",
      "Ikut kelas Sabtu 12 Des.",
    ],
  },
  faq: {
    title: "FAQ",
    items: <RichFaq[]>[
      {
        q: "Kenapa gratis?",
        a: "Aku sedang membangun kelas ini dan butuh masukan jujur dari peserta.",
      },
      {
        q: "Direkam?",
        a: "Ya, untuk evaluasi. Wajah dan nama peserta tidak dipakai tanpa izin tertulis.",
      },
      {
        q: "Harus langganan?",
        a: "Ya. ChatGPT Plus atau Claude Pro harus aktif saat kelas (sekitar US$20 per bulan). Supaya semua peserta punya fitur dan batas pemakaian yang cukup selama 2 jam praktik.",
      },
      {
        q: "Data kamu",
        a: [
          "Data form hanya dipakai untuk memilih peserta dan menghubungi kamu soal kelas ini, lalu dihapus paling lambat 3 bulan setelah kelas. Minta hapus kapan saja lewat ",
          { text: "WhatsApp", href: waLink("") },
          " atau ",
          { text: "email", href: `mailto:${SITE.email}` },
          ".",
        ],
      },
    ],
  },
};
