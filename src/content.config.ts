import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).min(1),
  }),
});

const weeknotes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/weeknotes" }),
  schema: z.object({
    week: z.string(),
    date: z.date(),
  }),
});

export const collections = { notes, weeknotes };
