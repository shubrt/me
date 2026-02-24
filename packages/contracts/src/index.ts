import { z } from "zod";

export const repoSchema = z.object({
  name: z.string(),
  description: z.string().default(""),
  url: z.string().url(),
  language: z.string().nullable(),
  stars: z.number().int().nonnegative(),
  // GitHub sends "2026-02-24T19:00:00Z". A bare local time would be a bug upstream, reject it.
  pushedAt: z.string().datetime({ offset: true }),
  activity: z.array(z.number().int().nonnegative()).length(12),
});

export const reposSchema = z.array(repoSchema);

export type Repo = z.infer<typeof repoSchema>;
