import { describe, expect, it } from "vite-plus/test";

import { ageVersion, blocks, fmt, tk } from "@shubrt/session";

describe("fmt", () => {
  it("keeps small numbers plain and abbreviates thousands", () => {
    expect(fmt(999)).toBe("999");
    expect(fmt(1780)).toBe("1.8k");
  });
});

describe("tk", () => {
  it("never reports fewer than one token", () => {
    expect(tk("")).toBeGreaterThanOrEqual(1);
  });
});

describe("blocks", () => {
  it("normalizes against the global maximum", () => {
    // 0 -> " ", 1/10 -> lowest block
    expect(blocks([0, 0, 1], 10)).toBe("  ▁");
    expect(blocks([10], 10)).toBe("█");
  });
});

describe("ageVersion", () => {
  it("counts years, months since birthday, and extra days", () => {
    // Local Date construction on purpose: ageVersion reads local fields.
    expect(ageVersion(new Date(2026, 7, 22))).toBe("v27.11.4");
    expect(ageVersion(new Date(2026, 8, 18))).toBe("v28.0.0");
  });
});
