export const SITE = {
  url: "https://adyan.admos.id",
  name: "Adyan Rohutomo",
  whatsapp: "6285717913273",
  email: "madyanr@gmail.com",
  github: "https://github.com/muhadyan",
  linkedin: "https://www.linkedin.com/in/adyan-rohutomo",
  cv: "/M_Adyan_Rohutomo_CV.pdf",
  // Umami Cloud website ID. Public by design: it ships in every page.
  umamiId: "5fab8445-64a5-4c45-84f1-17010ff005fb",
} as const;

/** Builds a WhatsApp click-to-chat link with a prefilled message. */
export function waLink(message: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
