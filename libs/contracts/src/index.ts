import { z } from "zod";

// One public repo as the terminal shows it. Built at build time from the
// GitHub API, cached as JSON, and rendered by the /projects command.
export const repoSchema = z.object({
  /** Display index "01".."06", assigned after sorting by push date. */
  id: z.string(),
  /** Full name, e.g. "shubrt/skills". */
  name: z.string(),
  url: z.url(),
  /** Empty string allowed; GitHub returns null for missing descriptions. */
  description: z.string(),
  /** Lowercase primary language, "" when GitHub reports null. */
  language: z.string(),
  stars: z.number().int().nonnegative(),
  /** ISO timestamp with offset, straight from the API. */
  pushedAt: z.iso.datetime({ offset: true }),
  /** Human age of the last push: "2h", "3d", "2w", "1mo". */
  pushedLabel: z.string(),
  /** Commits per week, last 12 weeks, oldest first. */
  activity: z.array(z.number().int().nonnegative()).length(12),
});

export const reposSchema = z.array(repoSchema).min(1).max(12);

// One titled group of key/value rows, the shape /whoami renders.
export const whoamiGroupSchema = z.object({
  title: z.string(),
  rows: z.array(z.tuple([z.string(), z.string()])).min(1),
});

export const whoamiSchema = z.array(whoamiGroupSchema).min(1);

export type Repo = z.infer<typeof repoSchema>;
export type WhoamiGroup = z.infer<typeof whoamiGroupSchema>;
