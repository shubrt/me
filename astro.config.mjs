import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://shubrt.me",
  trailingSlash: "never",
  integrations: [sitemap({ filter: (page) => !page.endsWith("/404") })],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: { theme: "github-dark-default" },
  },
});
