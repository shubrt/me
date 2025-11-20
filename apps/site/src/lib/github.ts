export interface RepoInfo {
  stars: number;
  pushedAt: string;
  language: string | null;
}

interface ApiRepo {
  stargazers_count: number;
  pushed_at: string;
  language: string | null;
}

export function mapRepo(raw: ApiRepo): RepoInfo {
  return { stars: raw.stargazers_count, pushedAt: raw.pushed_at, language: raw.language };
}

/** Fetches one repo. Returns null on any failure so the build never depends on the API. */
export async function fetchRepo(fullName: string): Promise<RepoInfo | null> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (import.meta.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${import.meta.env.GITHUB_TOKEN}`;
  try {
    const res = await fetch(`https://api.github.com/repos/${fullName}`, { headers });
    if (!res.ok) {
      console.warn(`github: ${fullName} responded ${res.status}, using local data`);
      return null;
    }
    return mapRepo((await res.json()) as ApiRepo);
  } catch {
    return null;
  }
}
