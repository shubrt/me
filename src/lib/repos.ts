import cache from "../data/repos.cache.json";
import { fetchRepo, type RepoInfo } from "./github";

type Cache = Record<string, RepoInfo>;

/**
 * Repo info for the projects page. Live from the API when a token is set,
 * otherwise from the committed cache so unauthenticated builds stay stable.
 */
export async function repoInfo(fullName: string): Promise<RepoInfo | null> {
  const cached = (cache as Cache)[fullName] ?? null;
  if (!import.meta.env.GITHUB_TOKEN) return cached;
  return (await fetchRepo(fullName)) ?? cached;
}
