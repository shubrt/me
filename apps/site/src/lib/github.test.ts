import { describe, expect, it } from "vitest";
import { mapActivity, mapRepo } from "./github";

describe("mapRepo", () => {
  it("keeps only the fields the page needs", () => {
    expect(mapRepo({ stargazers_count: 3, pushed_at: "2025-06-18T20:00:00Z", language: "Astro", extra: true } as never)).toEqual({
      stars: 3,
      pushedAt: "2025-06-18T20:00:00Z",
      language: "Astro",
      activity: Array(12).fill(0),
    });
  });

  it("passes a null language through instead of inventing one", () => {
    expect(mapRepo({ stargazers_count: 0, pushed_at: "2025-09-16T18:00:00Z", language: null }).language).toBeNull();
  });
});

describe("mapActivity", () => {
  it("keeps the last twelve weeks", () => {
    expect(mapActivity(Array.from({ length: 52 }, (_, i) => ({ total: i })))).toEqual([40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]);
  });

  it("pads a young repo with zeros at the front", () => {
    expect(mapActivity([{ total: 2 }, { total: 5 }])).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5]);
  });
});
