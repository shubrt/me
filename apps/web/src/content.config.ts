import { defineCollection } from "astro:content";
import { loadRepos } from "./data/github.ts";

// Deliberately no `schema` here: validation happens in @shubrt/contracts
// with the catalog zod. Astro ships its own zod (astro/zod), and mixing two
// zod instances in one schema produces unreadable type errors.
const repos = defineCollection({
  loader: async () => (await loadRepos()).map((repo) => ({ ...repo, id: repo.id })),
});

export const collections = { repos };
