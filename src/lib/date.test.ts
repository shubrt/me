import { describe, expect, it } from "vitest";
import { formatDate } from "./date";

describe("formatDate", () => {
  it("formats in utc so frontmatter dates do not shift", () => {
    expect(formatDate(new Date("2025-01-03"))).toBe("3 Jan 2025");
    expect(formatDate(new Date("2025-01-03"), "long")).toBe("3 January 2025");
  });
});
