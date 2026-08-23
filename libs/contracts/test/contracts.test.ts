import { describe, expect, it } from "vite-plus/test";

import { repoSchema, reposSchema, whoamiSchema } from "@shubrt/contracts";

const validRepo = {
  id: "01",
  name: "shubrt/skills",
  url: "https://github.com/shubrt/skills",
  description: "Agent skills, packaged",
  language: "typescript",
  stars: 42,
  pushedAt: "2026-08-23T00:06:21Z",
  pushedLabel: "2h",
  activity: [0, 1, 2, 0, 4, 3, 0, 0, 5, 1, 2, 6],
};

const validWhoami = [
  { title: "work", rows: [["role", "software architect"]] },
  { title: "offline", rows: [["music", "piano, guitar"]] },
];

describe("repo and whoami schemas", () => {
  it("parses a valid repo, repo list, and whoami groups", () => {
    expect(repoSchema.safeParse(validRepo).success).toBe(true);
    expect(reposSchema.safeParse([validRepo]).success).toBe(true);
    expect(whoamiSchema.safeParse(validWhoami).success).toBe(true);
  });

  it("rejects activity arrays that are not exactly 12 entries", () => {
    const short = { ...validRepo, activity: validRepo.activity.slice(0, 11) };
    expect(repoSchema.safeParse(short).success).toBe(false);
  });

  it("requires an offset or Z on pushedAt", () => {
    const bare = { ...validRepo, pushedAt: "2026-08-23T00:06:21" };
    expect(repoSchema.safeParse(bare).success).toBe(false);

    const zulu = { ...validRepo, pushedAt: "2026-08-23T00:06:21Z" };
    expect(repoSchema.safeParse(zulu).success).toBe(true);

    const offset = { ...validRepo, pushedAt: "2026-08-23T00:06:21+02:00" };
    expect(repoSchema.safeParse(offset).success).toBe(true);
  });
});
