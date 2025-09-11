// Refreshes src/data/repos.cache.json from the GitHub API. Run with a GITHUB_TOKEN set.
import { writeFile } from "node:fs/promises";
import projects from "../src/data/projects.json";

const names = projects.map((p) => p.url?.match(/github\.com\/([^/]+\/[^/]+)/)?.[1]).filter((n): n is string => Boolean(n));
const out: Record<string, unknown> = {};
for (const name of names) {
  const res = await fetch(`https://api.github.com/repos/${name}`, { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } });
  if (!res.ok) throw new Error(`${name}: ${res.status}`);
  const raw = await res.json();
  out[name] = { stars: raw.stargazers_count, pushedAt: raw.pushed_at, language: raw.language };
}
await writeFile("src/data/repos.cache.json", JSON.stringify(out, null, 2) + "\n");
console.log(`cached ${names.length} repos`);
