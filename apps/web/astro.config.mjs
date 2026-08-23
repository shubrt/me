import react from "@astrojs/react";
import { defineConfig } from "astro/config";

// Fully static output; an adapter only enters once server islands are needed.
export default defineConfig({
  site: "https://shubrt.me",
  output: "static",
  integrations: [react()],
  devToolbar: { enabled: false },
});
