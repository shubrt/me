import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// Static pages. The only server code is the contact worker in `src/_/worker.ts`.
export default defineConfig({
  site: "https://shubrt.me",
  output: "static",
  trailingSlash: "always",
  build: { inlineStylesheets: "always" },
  integrations: [
    sitemap({
      i18n: { defaultLocale: "de", locales: { de: "de", en: "en" } },
    }),
  ],
  devToolbar: { enabled: false },
});
