import type { Copy } from "./types";

export const id: Copy = {
  meta: {
    title: "Jasa Pembuatan Aplikasi Kasir, Stok, Pembukuan & ERP | Adyan Rohutomo",
    description:
      "Aku bikin sistem untuk bisnismu: kasir, stok gudang, pembukuan, faktur, sampai ERP. Mantan VP Business Support, 4 tahun jadi software engineer (termasuk Tokopedia).",
  },
  nav: { skip: "Langsung ke isi", langLabel: "Pilih bahasa", contact: "Chat WhatsApp" },
  wa: { message: "Halo Adyan, aku lihat adyan.admos.id. Mau konsultasi bikin sistem untuk bisnisku." },
  hero: {
    title: "Bisnismu masih jalan pakai Excel, bon, dan chat? Aku bikinin sistemnya.",
    lede: "Stok gudang, kasir, pembukuan, tracking project, website company, sampai ERP. Rapi, bisa dibuka dari HP, dan laporannya jalan sendiri.",
    proof:
      "Sebelum jadi software engineer, aku 5+ tahun di Finance. Terakhir sebagai VP Business Support yang pegang tim Finance, HR, dan GA. Jadi aku paham alurnya dari sisi yang pakai.",
    cta: "Konsultasi gratis via WhatsApp",
    ctaNote: "Cerita dulu aja. Gratis, tanpa komitmen.",
    receipt: {
      heading: "Nota pesanan",
      number: "No. 0001",
      to: "Untuk: bisnismu",
      lines: [
        "Penjualan tercatat otomatis",
        "Stok real-time + print barcode",
        "Faktur, retur, pembatalan",
        "Laporan keuangan otomatis",
        "Tracking project + update ke klien",
        "Website company / katalog",
      ],
      totalLabel: "Total",
      total: "Budget menyesuaikan",
      stamp: "Siap dibangun",
      thanks: "Terima kasih. Simpan nota ini.",
    },
  },
  needs: {
    title: "Masalahmu, sistemnya, buktinya",
    intro: "Ini kebutuhan yang paling sering aku temui. Tiap baris sudah pernah aku kerjakan.",
    columns: { need: "Masalahmu", build: "Aku bikinin", proof: "Buktinya" },
    rows: [
      {
        need: "Penjualan masih dicatat di bon",
        build: "Kasir web. Transaksi tercatat, struk dan faktur bisa diprint, pembatalan dan retur ada jejaknya.",
        proof: "Admos Laris",
      },
      {
        need: "Stok gudang nggak pernah cocok",
        build: "Stok real-time, label barcode atau QR, catatan barang keluar-masuk, pengingat stok menipis.",
        proof: "Admos Laris",
      },
      {
        need: "Laporan keuangan dikerjakan tiap akhir bulan",
        build: "Pembukuan otomatis. Jurnal, laba rugi, neraca, dan arus kas langsung dari transaksi.",
        proof: "Admos Accounting",
      },
      {
        need: "Orderan dari chat berantakan",
        build: "Order dari WhatsApp dan DM jadi rapi. Alamat dibaca AI, ongkir dibandingkan, resi terlacak.",
        proof: "RingkasAja",
      },
      {
        need: "Butuh satu sistem untuk Finance, HR, dan GA",
        build: "ERP yang ikut alur kantormu. Keuangan, karyawan, aset, dan persetujuan dalam satu tempat.",
        proof: "5+ tahun memimpin Finance, HR, GA",
      },
      {
        need: "Klien terus tanya progres project",
        build: "Sistem tracking project. Status per tahap, update otomatis ke klien, riwayat lengkap.",
        proof: "11 sistem untuk 11 klien",
      },
      {
        need: "Butuh website company atau katalog",
        build: "Website cepat yang mudah diupdate dan gampang ditemukan di Google.",
        proof: "Situs yang sedang kamu buka",
      },
      {
        need: "Sistem lama lambat atau sering error",
        build: "Audit, perbaikan bug, dan rombak sistem di balik layar tanpa mengganggu yang sedang jalan.",
        proof: "Search Array, 5x lebih cepat",
      },
    ],
  },
  products: {
    title: "Produk yang aku bangun sendiri",
    intro: "Tiga produk ini aku rancang, bangun, dan jalankan sendiri dari nol sampai live.",
    visit: "Buka situsnya",
    statusLabel: "Status",
    stackLabel: "Dibuat dengan",
    items: [
      {
        slug: "admos-accounting",
        name: "Admos Accounting",
        tagline: "Pembukuan simpel untuk UMKM",
        summary:
          "Jurnal, daftar akun, aset, dan laporan keuangan di satu tempat. Foto nota, AI bikin draf jurnalnya, kamu tinggal setujui.",
        points: [
          "5 laporan otomatis: laba rugi, neraca, arus kas, buku besar, neraca saldo",
          "Langganan dibayar lewat QRIS dan 14 metode lain (Duitku)",
          "600+ tes otomatis menjaga angka tetap benar",
        ],
        status: "Live, sudah menerima pembayaran",
        stack: ["Go", "PostgreSQL", "Next.js", "AI"],
      },
      {
        slug: "admos-laris",
        name: "Admos Laris",
        tagline: "Kasir untuk stan fashion di pameran dan bazar",
        summary:
          "Label QR untuk tiap varian, scan pakai kamera HP, bayar QRIS atau tunai, struk untuk pembeli. Tetap jalan walau sinyal di venue hilang.",
        points: [
          "Layar kedua menghadap pembeli, update langsung",
          "Saldo dicatat sebagai buku besar yang tidak bisa diubah diam-diam",
          "Alamat pembeli dibaca AI untuk hitung ongkir",
        ],
        status: "Pra-rilis, uji coba dengan merchant pertama",
        stack: ["Go", "PostgreSQL", "Next.js PWA", "QRIS"],
      },
      {
        slug: "ringkasaja",
        name: "RingkasAja",
        tagline: "Dari chat ke resi, 30 detik",
        summary:
          "Tempel chat orderan, AI baca alamatnya, bandingkan ongkir, pesan kurir, lalu lacak paketnya. Uang pembeli tidak pernah lewat sistem.",
        points: [
          "16 status order yang diuji satu per satu",
          "Dompet dengan pembukuan double-entry",
          "Terhubung ke WhatsApp, kurir, dan pembayaran",
        ],
        status: "Beta, khusus undangan",
        stack: ["Go", "PostgreSQL", "Next.js", "WhatsApp API"],
      },
    ],
  },
  clients: {
    title: "Klien dan tempat kerja",
    intro:
      "Untuk bisnis, aku pegang sistemnya dari depan sampai belakang. Di perusahaan teknologi, bagianku backend: server, database, dan integrasi di balik layar.",
    visit: "Lihat situsnya",
    featured: [
      {
        slug: "ummu-alfatih",
        name: "Ummu Alfatih",
        role: "Toko online dan sistem bisnis",
        period: "2025 sampai sekarang",
        summary:
          "Brand busana muslimah dari Yogyakarta. Aku siapkan toko online-nya, pembukuannya jalan di Admos Accounting, dan kasir bazarnya sedang uji coba Admos Laris.",
        figures: [
          { value: "3", label: "sistem: toko online, pembukuan, kasir bazar" },
          { value: "2025 →", label: "masih jalan sampai sekarang" },
        ],
      },
      {
        slug: "search-array",
        name: "Search Array",
        role: "Senior Backend Engineer, Sera Creative Studio",
        period: "2025 sampai sekarang",
        summary:
          "Platform kartu game Jepang dengan 46 ribu pengguna dan 20 juta request per bulan. Aku tulis ulang backend-nya dari Laravel ke Go.",
        figures: [
          { value: "−80%", label: "waktu respons" },
          { value: "−99%", label: "error server" },
          { value: "−75%", label: "biaya server" },
        ],
      },
      {
        slug: "tokopedia",
        name: "Tokopedia",
        role: "Software Engineer, Backend (Promotion)",
        period: "2023 sampai 2025",
        summary: "Menyatukan sistem promo Tokopedia dengan TikTok Shop, termasuk voucher gratis ongkir.",
        figures: [
          { value: "+11%", label: "GMV" },
          { value: "+9,6%", label: "GMV per pengunjung" },
          { value: "+11,3%", label: "halaman promo ke order" },
        ],
      },
      {
        slug: "katalis",
        name: "Katalis AI",
        role: "Founding Backend Engineer",
        period: "2023 sampai 2025",
        summary: "Membangun backend dari nol untuk aplikasi AI yang membantu perusahaan mengoptimalkan konten marketing.",
        figures: [
          { value: "0 → 1", label: "backend dari nol" },
          { value: "CI/CD", label: "deploy otomatis" },
        ],
      },
      {
        slug: "wateriq",
        name: "WaterIQ",
        role: "Backend Initiator, Solarchapter",
        period: "2023",
        summary: "Sistem IoT untuk memantau air bersih di desa-desa Indonesia. Backend-nya aku bangun dari awal.",
        figures: [
          { value: "0 → 1", label: "backend dari nol" },
          { value: "IoT", label: "data sensor terjadwal" },
        ],
      },
    ],
    othersTitle: "Juga pernah mengerjakan backend untuk",
    others: [
      { name: "Lion Parcel", note: "lewat Refactory, 2022" },
      { name: "Lemonilo", note: "lewat Refactory, 2022" },
      { name: "Jaklingko", note: "lewat Refactory, 2022" },
      { name: "Work Life and Beyond", note: "aplikasi HR, 2023" },
    ],
  },
  why: {
    title: "Dulu aku yang pakai sistemnya",
    story: [
      "Sebelum menulis kode, aku kerja 5+ tahun di Finance. Naik jadi Finance Manager, lalu VP Business Support yang memimpin tim Finance, HR, dan General Affairs.",
      "Jadi waktu kamu bilang “stok nggak cocok” atau “laporan telat terus”, aku tahu rasanya. Aku pernah di kursi itu.",
      "Sekarang, setelah 4 tahun jadi software engineer di Tokopedia dan untuk 11 klien, aku bikin sistem yang dulu aku pengen punya.",
    ],
    figures: [
      { value: "5+", label: "tahun di Finance, HR, GA" },
      { value: "4", label: "tahun jadi software engineer" },
      { value: "11", label: "sistem untuk 11 klien" },
      { value: "99,9%", label: "uptime server" },
    ],
    photoAlt: "Foto Adyan Rohutomo",
  },
  process: {
    title: "Cara kerjanya",
    steps: [
      {
        title: "Ngobrol dulu",
        body: "Ceritakan alur bisnismu lewat WhatsApp atau call. Aku bantu pilah mana yang perlu dibikin dan mana yang cukup pakai aplikasi yang sudah ada.",
      },
      {
        title: "Rancang",
        body: "Kamu dapat daftar fitur, contoh tampilan, jadwal, dan biaya yang jelas sebelum mulai.",
      },
      {
        title: "Bangun",
        body: "Tiap minggu ada demo yang bisa kamu coba sendiri. Masukanmu langsung dikerjakan.",
      },
      {
        title: "Live dan dirawat",
        body: "Sistem dipasang, timmu diajari cara pakainya, dan aku tetap bantu kalau ada kendala.",
      },
    ],
  },
  faq: {
    title: "Yang sering ditanya",
    items: [
      {
        q: "Budget-nya berapa?",
        a: "Tergantung fitur dan skala. Setelah ngobrol, kamu dapat rincian biaya per fitur, jadi bisa mulai dari yang paling penting dulu.",
      },
      {
        q: "Berapa lama sampai bisa dipakai?",
        a: "Sistem kecil seperti kasir atau stok bisa dipakai dalam hitungan minggu. Sistem besar seperti ERP dibagi per tahap, dan tiap tahap langsung bisa dipakai.",
      },
      {
        q: "Setelah jadi, siapa yang merawat?",
        a: "Aku bisa lanjut merawatnya. Detail perawatan kita sepakati di awal, jadi nggak ada biaya kejutan.",
      },
    ],
  },
  footer: {
    title: "Ceritakan kebutuhanmu",
    body: "Kirim pesan WhatsApp. Mulai dari bagian yang paling bikin pusing.",
    cta: "Chat WhatsApp",
    email: "Atau email",
    cv: "Unduh CV (PDF, bahasa Inggris)",
    github: "GitHub",
    linkedin: "LinkedIn",
  },
};
