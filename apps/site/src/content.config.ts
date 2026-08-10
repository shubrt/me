import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Notes moved to docs/archive/notes. The collection stays so the pages still build until apps/site is removed.
const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "../../docs/archive/notes" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).min(1),
  }),
});

export const collections = { notes };
