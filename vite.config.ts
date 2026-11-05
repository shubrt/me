import { defineConfig } from "vite-plus";

export default defineConfig({
  // `vp test` runs every workspace suite from the repository root; each package
  // keeps its tests in `src/test/`.
  test: {
    include: ["{apps,libs}/*/src/test/**/*.test.ts"],
  },

  lint: {
    ignorePatterns: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.cache/**",
      "**/.vite/**",
      "**/.output/**",
      "**/.example/**",
      "**/.claude/**",
      "**/.gemini/**",
      "**/.cursor/**",
      "**/*.gen.ts",
      "**/.astro/**",
      "**/.wrangler/**",
      "apps/web/archive/**",
      "docs/reference-prototype.html",
    ],
    options: { typeAware: true, typeCheck: true },
  },

  fmt: {
    ignorePatterns: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.cache/**",
      "**/.vite/**",
      "**/.output/**",
      "**/.example/**",
      "**/.claude/**",
      "**/.gemini/**",
      "**/.cursor/**",
      "**/*.gen.ts",
      "**/.astro/**",
      "**/.wrangler/**",
      "apps/web/archive/**",
      "docs/reference-prototype.html",
    ],
  },

  staged: {
    "*.{js,jsx,ts,tsx,json,jsonc,css,md,mdx}": "vp check --fix",
  },
});
