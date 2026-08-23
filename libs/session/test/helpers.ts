// Shared fixtures for the session tests: deterministic rngs and a small
// SessionData built through prepareData, matching the contracts schemas.

import type { Repo, WhoamiGroup } from "@shubrt/contracts";
import { prepareData, type Rng, type SessionData } from "@shubrt/session";

/** Plays back the given values, then repeats the last one (or 0.5). */
export const rngOf = (...vals: number[]): Rng => {
  let i = 0;
  return () => vals[Math.min(i++, vals.length - 1)] ?? 0.5;
};

/** mulberry32, a tiny seeded PRNG with values in [0, 1). */
export const mulberry32 = (seed: number): Rng => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t = (t + Math.imul(t ^ (t >>> 7), t | 61)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const repos: Repo[] = [
  {
    id: "01",
    name: "shubrt/skills",
    url: "https://github.com/shubrt/skills",
    description: "Agent skills, packaged",
    language: "typescript",
    stars: 42,
    pushedAt: "2026-08-22T10:00:00Z",
    pushedLabel: "2h",
    activity: [0, 1, 2, 0, 4, 3, 0, 0, 5, 1, 2, 6],
  },
  {
    id: "02",
    name: "shubrt/pipes",
    url: "https://github.com/shubrt/pipes",
    description: "",
    language: "go",
    stars: 7,
    pushedAt: "2026-08-19T08:30:00+02:00",
    pushedLabel: "3d",
    activity: [1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 3, 0],
  },
];

export const whoami: WhoamiGroup[] = [
  {
    title: "work",
    rows: [
      ["role", "software architect"],
      ["focus", "web infrastructure"],
    ],
  },
  {
    title: "stack",
    rows: [
      ["daily", "typescript"],
      ["data", "postgres"],
    ],
  },
  {
    title: "place",
    rows: [
      ["city", "mainz"],
      ["country", "germany"],
    ],
  },
  {
    title: "offline",
    rows: [
      ["music", "piano, guitar"],
      ["sport", "basketball"],
    ],
  },
];

export const makeData = (rng: Rng = rngOf(0.5)): SessionData => prepareData({ repos, whoami }, rng);
