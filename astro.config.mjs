import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://adyan.admos.id",
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
  integrations: [sitemap({ filter: (page) => !page.includes("/og") })],
});
