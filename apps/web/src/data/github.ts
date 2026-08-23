import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { reposSchema, type Repo } from "@shubrt/contracts";

// Committed fallback: refreshed after every successful fetch, read whenever
// the GitHub API is unreachable. The build never runs with an empty list.
const CACHE_PATH = fileURLToPath(new URL("../../data/repos.cache.json", import.meta.url));

const API = "https://api.github.com";
const USER = "shubrt";
const SHOWN = 6;
const WEEKS = 12;

type GithubRepo = {
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  private: boolean;
};

function headers(): Record<string, string> {
  const base: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "shubrt.me-build",
  };
  const token = process.env["GITHUB_TOKEN"];
  if (token) base["Authorization"] = `Bearer ${token}`;
  return base;
}

/** "2h", "3d", "2w", "1mo" from the distance between pushed_at and now. */
export function pushedLabel(pushedAt: string, now = Date.now()): string {
  const minutes = Math.max(1, Math.round((now - Date.parse(pushedAt)) / 60_000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w`;
  return `${Math.floor(days / 30)}mo`;
}

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

/**
 * Last 12 weekly commit totals for one repo. Status 202 means GitHub is
 * still computing the statistic: retry once after 1.5s, then fall back to
 * zeros. Never aborts the build.
 */
async function fetchActivity(name: string): Promise<number[]> {
  const zeros = Array.from({ length: WEEKS }, () => 0);
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(`${API}/repos/${name}/stats/commit_activity`, { headers: headers() });
    if (res.status === 202) {
      await sleep(1500);
      continue;
    }
    if (!res.ok) return zeros;
    const weeks = (await res.json()) as { total: number }[];
    if (!Array.isArray(weeks) || weeks.length === 0) return zeros;
    const totals = weeks.map((w) => Math.max(0, Math.round(w.total ?? 0)));
    return [...zeros, ...totals].slice(-WEEKS);
  }
  return zeros;
}

async function fetchRepos(): Promise<Repo[]> {
  const res = await fetch(`${API}/users/${USER}/repos?per_page=100&sort=pushed`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`GitHub responded ${res.status} for the repo list`);
  const all = (await res.json()) as GithubRepo[];
  if (!Array.isArray(all)) throw new Error("GitHub repo list is not an array");

  const picked = all
    .filter((r) => !r.fork && !r.archived && !r.private)
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
    .slice(0, SHOWN);

  const repos: Repo[] = [];
  for (const [index, r] of picked.entries()) {
    repos.push({
      id: String(index + 1).padStart(2, "0"),
      name: r.full_name,
      url: r.html_url,
      description: r.description ?? "",
      language: (r.language ?? "").toLowerCase(),
      stars: r.stargazers_count,
      pushedAt: r.pushed_at,
      pushedLabel: pushedLabel(r.pushed_at),
      activity: await fetchActivity(r.full_name),
    });
  }
  return reposSchema.parse(repos);
}

/**
 * Repos for the /projects command, resolved at build time. On success the
 * committed cache is refreshed; on any failure (network, rate limit,
 * schema) the cache is the answer. If both fail, the build aborts.
 */
export async function loadRepos(): Promise<Repo[]> {
  try {
    const repos = await fetchRepos();
    await writeFile(CACHE_PATH, `${JSON.stringify(repos, null, 2)}\n`);
    return repos;
  } catch (error) {
    console.warn(`[github] live fetch failed, using ${CACHE_PATH}:`, error);
    const cached: unknown = JSON.parse(await readFile(CACHE_PATH, "utf8"));
    return reposSchema.parse(cached);
  }
}
