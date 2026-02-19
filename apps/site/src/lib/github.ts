export interface RepoInfo {
  stars: number;
  pushedAt: string;
  language: string | null;
  /** Commits per week, last 12 weeks, oldest first. */
  activity: number[];
}

interface ApiRepo {
  stargazers_count: number;
  pushed_at: string;
  language: string | null;
}

export function mapRepo(raw: ApiRepo, weeks: Array<{ total: number }> = []): RepoInfo {
  return { stars: raw.stargazers_count, pushedAt: raw.pushed_at, language: raw.language, activity: mapActivity(weeks) };
}

/** Last 12 weekly totals, padded with zeros at the front when the repo is younger. */
export function mapActivity(weeks: Array<{ total: number }>): number[] {
  const totals = weeks.map((w) => w.total).slice(-12);
  return [...Array(Math.max(0, 12 - totals.length)).fill(0), ...totals];
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
    let stats = await fetch(`https://api.github.com/repos/${fullName}/stats/commit_activity`, { headers });
    if (stats.status === 202) {
      await new Promise((r) => setTimeout(r, 1500));
      stats = await fetch(`https://api.github.com/repos/${fullName}/stats/commit_activity`, { headers });
    }
    const weeks = stats.ok && stats.status !== 202 ? ((await stats.json()) as Array<{ total: number }>) : [];
    return mapRepo((await res.json()) as ApiRepo, weeks);
  } catch {
    return null;
  }
}
