/// <reference types="vitest" />
import { getViteConfig } from "astro/config";
import { defineConfig } from "vitest/config";

export default getViteConfig({
  test: {
    include: ["src/**/*.test.ts"],
  },
});
