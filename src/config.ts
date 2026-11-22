export const SITE = {
  url: "https://adyan.admos.id",
  name: "Adyan Rohutomo",
  // WhatsApp Business number for every WhatsApp button. The Maps phone (BUSINESS.phone) stays 0857.
  whatsapp: "6282138735653",
  email: "madyanr@gmail.com",
  github: "https://github.com/muhadyan",
  linkedin: "https://www.linkedin.com/in/adyan-rohutomo",
  cv: "/M_Adyan_Rohutomo_CV.pdf",
  // Umami website ID (self-hosted at stats.admos.id). Public by design: it ships in every page.
  umamiId: "27ab60d7-b40c-43fd-a291-79d167236aea",
  umamiSrc: "https://stats.admos.id/script.js",
  // Google Search Console ownership tag (URL-prefix property). Public by design.
  googleSiteVerification: "A-QaRN3Vz4fVbXUT2m2VsmfnlSglUvS73LB0821Er7g",
} as const;

/** The free "AI untuk Kerja" class page (/kelas). */
export const KELAS = {
  // Google Form behind every Daftar button. The one value to change when the real link arrives.
  formUrl: "https://forms.gle/REPLACE_ME",
  // Sign-ups close Tue 8 Dec 2026, 23:59 WIB. After this the page shows "Pendaftaran sudah ditutup".
  closesAt: "2026-12-08T23:59:59+07:00",
} as const;

/** Builds a WhatsApp click-to-chat link with a prefilled message. */
export function waLink(message: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
