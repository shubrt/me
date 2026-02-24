import { repoSchema } from "@shubrt/contracts";
import cache from "../data/repos.cache.json";
import { fetchRepo, type RepoInfo } from "./github";

type Cache = Record<string, RepoInfo>;

/**
 * Repo info for the projects page. Live from the API when a token is set,
 * otherwise from the committed cache so unauthenticated builds stay stable.
 */
export async function repoInfo(fullName: string): Promise<RepoInfo | null> {
  const cached = (cache as Cache)[fullName] ?? null;
  // Without a token the unauthenticated limit is 60 requests an hour, which CI shares with everyone.
  if (!import.meta.env.GITHUB_TOKEN) return cached;
  const live = await fetchRepo(fullName);
  if (live) {
    const parsed = repoSchema.pick({ stars: true, pushedAt: true, language: true, activity: true }).safeParse(live);
    if (!parsed.success) console.warn(`github: ${fullName} returned an unexpected shape, using the cache`);
    return parsed.success ? parsed.data : cached;
  }
  return cached;
}
