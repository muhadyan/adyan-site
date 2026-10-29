import type { Copy } from "./types";

export const id: Copy = {
  meta: {
    title: "Jasa Pembuatan Website, Aplikasi Kasir & Pembukuan | Adyan Rohutomo · Admos ERP",
    description:
      "Website usaha mulai Rp2,5 juta. Sistem kasir, stok, dan pembukuan mulai Rp5 juta. Dibuat oleh mantan VP Business yang kini di tahun ke-5 sebagai software engineer (ex Tokopedia). Yogyakarta.",
  },
  nav: { skip: "Langsung ke isi", langLabel: "Pilih bahasa", contact: "Chat WhatsApp" },
  wa: { message: "Halo Adyan, aku lihat adyan.admos.id. Mau minta estimasi untuk usahaku." },
  hero: {
    title: "Website dan sistem usaha yang ikut cara kerjamu.",
    lede: [
      { text: "Website mulai", price: "Rp2,5 juta" },
      { text: "Sistem kasir, stok, dan pembukuan mulai", price: "Rp5 juta" },
    ],
    cta: "Minta estimasi gratis via WhatsApp",
    ctaNote: "Kirim contoh nota/Excel/website yang kamu suka, aku balas dengan perkiraan biaya & waktu.",
    chip: "ex Tokopedia · 5+ th Finance",
    reply: "Biasanya dibalas di hari yang sama",
    hours: "(Senin-Sabtu, 09.00-17.00 WIB)",
    shotsCaption: "Toko online Ummu Alfatih · Kasir Admos Laris (contoh data)",
  },
  lanes: {
    title: "Mulai dari yang paling bikin pusing",
    other: "Layanan lain",
    from: "mulai",
    items: [
      {
        slug: "website",
        meta: {
          title: "Jasa Pembuatan Website Usaha mulai Rp2,5 juta | Adyan Rohutomo · Admos ERP",
          description:
            "Website company profile, katalog, atau toko online yang bisa kamu update sendiri. Mulai Rp2,5 juta untuk 5-7 halaman, domain & hosting 1 tahun. Yogyakarta.",
        },
        wa: "Halo Adyan, aku lihat paket website di adyan.admos.id. Usahaku: ... Contoh website yang aku suka: ...",
        card: {
          title: "Website",
          body: "Company profile, katalog, atau toko online. Isinya bisa kamu ubah sendiri.",
          cta: "Lihat paket website",
        },
        hero: {
          title: "Website usaha yang bisa kamu update sendiri.",
          lede: "Company profile, katalog, atau toko online. Rapi dibuka dari HP dan mudah ditemukan di Google.",
          scope: "untuk 5-7 halaman, domain & hosting 1 tahun",
          ctaNote: "Kirim contoh website yang kamu suka, aku balas dengan perkiraan biaya & waktu.",
        },
        packages: [
          {
            offer: "website",
            title: "Paket Website",
            lines: [
              "5-7 halaman desain khusus, rapi di HP",
              "Update isi sendiri (admin panel)",
              "Domain .com + hosting + SSL 1 tahun",
              "SEO dasar + Search Console",
              "3x revisi",
              "Selesai ±2 minggu",
            ],
            notes: ["Tahun ke-2 dst: Rp750 ribu/tahun (domain + hosting + SSL)."],
          },
        ],
        problems: [
          {
            need: "“Website susah diubah, harus minta tolong orang”",
            fix: "Admin panel untuk ganti foto, harga, dan teks sendiri dari HP.",
            proof: "Contoh: toko online Ummu Alfatih",
          },
          {
            need: "“Usaha belum muncul di Google”",
            fix: "SEO dasar dan Search Console dipasang sejak awal.",
            proof: "Contoh: situs yang sedang kamu buka",
          },
          {
            need: "“Website berat dibuka di HP”",
            fix: "Halaman ringan, cepat tampil walau sinyal lemah.",
            proof: "Contoh: situs ini",
          },
        ],
        faq: [
          {
            q: "Domain dan website atas nama siapa?",
            a: "Atas nama usahamu. Domain, akun hosting, dan source code didaftarkan atas nama klien, jadi tetap milikmu walau nanti ganti developer.",
          },
          {
            q: "Bisa jadi toko online dengan pembayaran?",
            a: "Bisa. Pembayaran online (QRIS, transfer bank, e-wallet) lewat payment gateway dihitung sebagai fitur tambahan di penawaran tertulis.",
          },
          {
            q: "Setelah tahun pertama bayar berapa?",
            a: "Rp750 ribu/tahun untuk domain .com, hosting, dan SSL. Isi website tetap bisa kamu ubah sendiri lewat admin panel.",
          },
        ],
      },
      {
        slug: "kasir",
        meta: {
          title: "Aplikasi Kasir & Stok untuk Usaha mulai Rp5 juta | Adyan Rohutomo · Admos ERP",
          description:
            "Sistem kasir dan stok sesuai alur tokomu: kasir di HP, stok real-time, scan barcode/QR, laporan harian. Mulai Rp5 juta untuk 1 outlet. Yogyakarta.",
        },
        wa: "Halo Adyan, aku lihat paket kasir & stok di adyan.admos.id. Usahaku: ... Jumlah outlet: ...",
        card: {
          title: "Kasir & stok",
          body: "Kasir di HP, stok berkurang tiap ada yang terjual, laporan harian langsung jadi.",
          cta: "Lihat paket kasir",
        },
        hero: {
          title: "Kasir dan stok yang ikut cara tokomu jualan.",
          lede: "Kasir di HP atau tablet, stok ikut berkurang tiap ada yang terjual, dan laporan harian langsung jadi.",
          scope: "untuk 1 outlet, akun kasir + admin",
          ctaNote: "Kirim foto nota atau file Excel stokmu, aku balas dengan perkiraan biaya & waktu.",
        },
        packages: [
          {
            offer: "kasir",
            title: "Paket Kasir & Stok",
            lines: [
              "1 outlet, akun kasir + admin",
              "Stok real-time",
              "Scan barcode/QR pakai HP",
              "Struk + laporan harian",
              "1x training, 60 hari pendampingan",
              "Selesai ±3-4 minggu",
            ],
            notes: [],
          },
        ],
        problems: [
          {
            need: "“Penjualan masih dicatat di buku atau bon”",
            fix: "Tiap transaksi tercatat di kasir, struk bisa diprint, pesanan yang dibatalkan tetap ada jejaknya.",
            proof: "Contoh: Admos Laris",
          },
          {
            need: "“Stok di catatan nggak pernah cocok dengan rak”",
            fix: "Stok per produk berkurang saat pesanan lunas dan tidak pernah menghalangi penjualan, label QR untuk tiap varian.",
            proof: "Contoh: Admos Laris",
          },
          {
            need: "“Jualan di bazar, sinyal sering hilang”",
            fix: "Penjualan tunai tetap tercatat saat jaringan gedung mati. QRIS tetap butuh jaringan.",
            proof: "Contoh: kasir bazar Ummu Alfatih (uji coba Admos Laris)",
          },
        ],
        faq: [
          {
            q: "Bisa untuk lebih dari satu outlet?",
            a: "Bisa. Paket ini dihitung untuk 1 outlet. Outlet tambahan, gudang, atau transfer stok antar cabang masuk ke penawaran tertulis.",
          },
          {
            q: "Perlu beli alat khusus?",
            a: "Tidak harus. Kasir jalan di HP, tablet, atau laptop yang sudah ada. Printer struk dan scanner barcode bisa ditambah kalau perlu.",
          },
          {
            q: "Data stok lama di Excel bisa dipindah?",
            a: "Bisa. Kirim file Excel-nya, data produk dan stok awal aku impor sebelum kasir mulai dipakai.",
          },
        ],
      },
      {
        slug: "pembukuan",
        meta: {
          title: "Sistem Pembukuan & ERP untuk Usaha mulai Rp10 juta | Adyan Rohutomo · Admos ERP",
          description:
            "Pembukuan otomatis dari transaksi: jurnal, laba rugi, neraca, arus kas. Mulai Rp10 juta untuk 1-3 cabang. ERP Finance, HR & GA per modul mulai Rp25 juta. Yogyakarta.",
        },
        wa: "Halo Adyan, aku lihat paket pembukuan di adyan.admos.id. Usahaku: ... Jumlah cabang: ...",
        card: {
          title: "Pembukuan & ERP",
          body: "Jurnal otomatis dari transaksi sampai laba rugi dan neraca. ERP per modul untuk Finance, HR, dan GA.",
          cta: "Lihat paket pembukuan",
        },
        hero: {
          title: "Laporan keuangan yang tersusun sendiri dari transaksi.",
          lede: "Jurnal, laba rugi, neraca, dan arus kas jadi otomatis. Untuk usaha yang lebih besar, ERP Finance, HR, dan GA dibangun per modul.",
          scope: "untuk 1-3 cabang, impor data awal dari Excel",
          ctaNote: "Kirim contoh laporan atau file Excel yang sekarang kamu pakai, aku balas dengan perkiraan biaya & waktu.",
        },
        packages: [
          {
            offer: "pembukuan",
            title: "Paket Pembukuan",
            lines: [
              "Jurnal otomatis dari transaksi",
              "Laba rugi, neraca, arus kas",
              "1-3 cabang",
              "Impor data awal dari Excel",
              "1x training, 90 hari pendampingan",
              "Selesai ±4-6 minggu",
            ],
            notes: [],
          },
          {
            offer: "erp",
            title: "Paket ERP",
            lines: [
              "Finance, HR, dan GA, dibangun per modul",
              "Tiap modul langsung bisa dipakai",
              "Ikut alur dan persetujuan di kantormu",
            ],
            notes: [],
          },
        ],
        problems: [
          {
            need: "“Laporan keuangan baru jadi tiap akhir bulan”",
            fix: "Jurnal, laba rugi, neraca, dan arus kas langsung tersusun dari transaksi.",
            proof: "Contoh: Admos Accounting",
          },
          {
            need: "“Nota numpuk, diinput satu per satu”",
            fix: "Foto nota, AI bikin draf jurnalnya, kamu tinggal setujui.",
            proof: "Contoh: Admos Accounting",
          },
          {
            need: "“Finance, HR, dan GA pakai file yang beda-beda”",
            fix: "ERP yang ikut alur kantormu: keuangan, karyawan, aset, dan persetujuan dalam satu tempat.",
            proof: "Pengalaman: 5+ tahun memimpin Finance, HR, dan GA",
          },
        ],
        faq: [
          {
            q: "Bedanya dengan aplikasi akuntansi langganan?",
            a: "Aplikasi langganan punya alurnya sendiri. Sistem ini dibangun mengikuti alur usahamu, dan source code serta datanya milikmu.",
          },
          {
            q: "Data lama di Excel bisa dipindah?",
            a: "Bisa. Saldo awal, daftar akun, dan data transaksi dari Excel aku impor sebelum sistem dipakai.",
          },
          {
            q: "ERP harus dibangun sekaligus?",
            a: "Tidak. ERP dibangun per modul, misalnya Finance dulu, lalu HR dan GA. Tiap modul langsung bisa dipakai.",
          },
        ],
      },
    ],
  },
  price: {
    heading: "Yang kamu dapat",
    from: "Mulai dari",
    final:
      "Harga final aku hitung setelah lihat alur usaha kamu, dan kamu dapat penawaran tertulis per fitur sebelum ada pembayaran apa pun.",
    finalShort: "Harga final setelah penawaran tertulis per fitur.",
    allTitle: "Berlaku untuk semua paket",
    all: [
      "Penawaran tertulis per fitur sebelum bayar",
      "30% DP · 40% saat demo · 30% serah terima",
      "Source code, database & akun hosting atas nama klien",
      "Garansi bug 90 hari · perawatan opsional ±10-15%/tahun",
    ],
    problemsTitle: "Masalah yang biasanya selesai",
    faqTitle: "Yang sering ditanya",
  },
  proof: [
    { value: "5+", label: "tahun di Finance, HR, dan GA" },
    { value: "2023–2025", label: "software engineer di Tokopedia" },
    { value: "3", label: "sistem jalan di Ummu Alfatih sejak 2025" },
    { value: "90 hari", label: "garansi bug di semua paket" },
  ],
  needs: {
    title: "Masalahmu, sistemnya, buktinya",
    intro: "Ini kebutuhan yang paling sering aku temui. Tiap baris sudah pernah aku kerjakan.",
    columns: { need: "Masalahmu", build: "Aku bikinin", proof: "Buktinya" },
    rows: [
      {
        need: "Penjualan masih dicatat di bon",
        build: "Kasir web. Tiap transaksi tercatat, struk bisa diprint, pesanan yang dibatalkan tetap ada jejaknya.",
        proof: "Admos Laris",
      },
      {
        need: "Stok gudang nggak pernah cocok",
        build: "Stok per produk berkurang saat pesanan lunas dan tidak pernah menghalangi penjualan, label QR untuk tiap varian.",
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
        proof: "Software engineer sejak 2022",
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
          "3.500+ tes otomatis menjaga angka tetap benar",
        ],
        status: "Live, sudah menerima pembayaran",
        stack: ["Go", "PostgreSQL", "Next.js", "AI"],
      },
      {
        slug: "admos-laris",
        name: "Admos Laris",
        tagline: "Kasir untuk stan fashion di pameran dan bazar",
        summary:
          "Label QR untuk tiap varian, scan pakai kamera HP, bayar QRIS atau tunai, struk untuk pembeli. Penjualan tunai tetap jalan saat jaringan gedung mati, QRIS tetap butuh jaringan.",
        points: [
          "Layar kedua menghadap pembeli, update langsung selama ada jaringan",
          "Saldo dicatat sebagai buku besar yang tidak bisa diubah diam-diam",
          "Satu Akun Admos dengan Admos Accounting. Penjualan Laris langsung tercatat di pembukuan, kalau usahanya juga pakai Accounting",
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
  showcase: {
    title: "Ummu Alfatih: toko online, pembukuan, dan kasir bazar",
    body: "Brand busana muslimah dari Yogyakarta. Toko online-nya aku siapkan, pembukuannya jalan di Admos Accounting, dan kasir bazarnya sedang uji coba Admos Laris.",
    visit: "Lihat tokonya",
    testimonial: {
      approved: true,
      quote:
        "Dulu penjualan bazar dan stok kami catat manual, rekapnya makan waktu. Sekarang toko online, pembukuan, dan kasir bazar kami tersambung, jadi laporannya lebih cepat kelihatan. Mas Adyan juga cepat bantu kalau ada kendala.",
      by: "Ummu Alfatih, brand busana muslimah, Yogyakarta",
    },
    workedAt: "Pernah kerja di: Tokopedia, Search Array (Sera Creative Studio), Katalis AI, Solarchapter, Refactory.",
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
    title: "Dulu di kursi Finance, sekarang yang membangun sistemnya",
    story: [
      "Sebelum menulis kode, aku kerja 5+ tahun di Finance. Naik jadi Finance Manager, lalu VP Business yang memimpin tim Finance, HR, dan General Affairs.",
      "Jadi waktu kamu bilang “stok nggak cocok” atau “laporan telat terus”, aku tahu rasanya. Aku pernah di kursi itu.",
      "Sekarang aku di tahun ke-5 sebagai software engineer, termasuk dua tahun di Tokopedia. Sistem yang aku bikin adalah sistem yang dulu aku pengen punya.",
    ],
    photoAlt: "Foto Adyan Rohutomo",
  },
  process: {
    title: "Cara kerjanya",
    steps: [
      {
        title: "Ngobrol dulu",
        body: "Ceritakan alur usahamu lewat WhatsApp atau call. Aku bantu pilah mana yang perlu dibikin dan mana yang cukup pakai aplikasi yang sudah ada.",
        tag: "Gratis",
      },
      {
        title: "Penawaran tertulis",
        body: "Daftar fitur, contoh tampilan, jadwal, dan harga per fitur. Belum ada pembayaran di tahap ini.",
        tag: "30% DP setelah penawaran disetujui",
      },
      {
        title: "Bangun",
        body: "Tiap minggu ada demo yang bisa kamu coba sendiri. Masukanmu langsung dikerjakan.",
        tag: "40% saat demo",
      },
      {
        title: "Serah terima",
        body: "Source code, database, dan akun hosting atas nama klien. Timmu diajari cara pakainya. Garansi bug 90 hari.",
        tag: "30% saat serah terima",
      },
    ],
  },
  faq: {
    title: "Yang sering ditanya",
    items: [
      {
        q: "Berapa biayanya?",
        a: "Website mulai Rp2,5 juta, kasir & stok mulai Rp5 juta, pembukuan mulai Rp10 juta, dan ERP mulai Rp25 juta. Harga final mengikuti fitur, dan kamu dapat penawaran tertulis per fitur sebelum ada pembayaran apa pun.",
      },
      {
        q: "Bagaimana pembayarannya?",
        a: "30% DP setelah penawaran disetujui, 40% saat demo, dan 30% saat serah terima.",
      },
      {
        q: "Source code dan data milik siapa?",
        a: "Milik klien. Source code, database, dan akun hosting dibuat atas nama usahamu, jadi kamu bebas lanjut dengan developer mana pun.",
      },
      {
        q: "Ada garansi?",
        a: "Ada. Bug yang muncul dalam 90 hari setelah serah terima diperbaiki tanpa biaya. Setelah itu tersedia perawatan opsional sekitar 10-15% dari nilai proyek per tahun.",
      },
      {
        q: "Berapa lama sampai bisa dipakai?",
        a: "Website sekitar 2 minggu, kasir & stok 3-4 minggu, pembukuan 4-6 minggu. ERP dibangun per modul, dan tiap modul langsung bisa dipakai.",
      },
      {
        q: "Bisa untuk usaha di luar Jogja?",
        a: "Bisa. Semua bisa dikerjakan online lewat WhatsApp dan Google Meet. Untuk usaha di Jogja dan sekitarnya, bisa juga ketemu langsung.",
      },
    ],
  },
  footer: {
    title: "Ceritakan kebutuhan usahamu",
    cta: "Minta estimasi gratis via WhatsApp",
    email: "Atau email",
    visit: "Datang langsung (janjian dulu via WhatsApp)",
    hours: "Senin sampai Sabtu, 09.00 sampai 17.00",
    map: "Lokasi Admos ERP di Google Maps",
    cv: "Unduh CV (PDF, bahasa Inggris)",
    github: "GitHub",
    linkedin: "LinkedIn",
  },
};
