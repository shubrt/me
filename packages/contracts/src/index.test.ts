import { describe, expect, it } from "vitest";
import { repoSchema } from "./index.ts";

const valid = {
  name: "shubrt/me",
  description: "This site",
  url: "https://github.com/shubrt/me",
  language: "Astro",
  stars: 0,
  pushedAt: "2026-02-24T19:00:00Z",
  activity: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 3],
};

describe("repoSchema", () => {
  it("accepts a complete repo", () => {
    expect(repoSchema.safeParse(valid).success).toBe(true);
  });

  it("insists on twelve weeks of activity", () => {
    expect(repoSchema.safeParse({ ...valid, activity: [1, 2, 3] }).success).toBe(false);
  });
});
