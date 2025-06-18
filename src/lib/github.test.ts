import { describe, expect, it } from "vitest";
import { mapRepo } from "./github";

describe("mapRepo", () => {
  it("keeps only the fields the page needs", () => {
    expect(mapRepo({ stargazers_count: 3, pushed_at: "2025-06-18T20:00:00Z", language: "Astro", extra: true } as never)).toEqual({
      stars: 3,
      pushedAt: "2025-06-18T20:00:00Z",
      language: "Astro",
    });
  });
});
