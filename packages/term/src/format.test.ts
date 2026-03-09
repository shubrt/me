import { describe, expect, it } from "vitest";
import { blocks, fmt, tk } from "./format.ts";

describe("blocks", () => {
  it("scales against the given maximum", () => {
    expect(blocks([0, 5, 10], 10)).toBe(" ▄█");
  });
  it("does not divide by zero", () => {
    expect(blocks([0, 0], 0)).toBe("  ");
  });
});

describe("fmt", () => {
  it("abbreviates thousands", () => {
    expect(fmt(999)).toBe("999");
    expect(fmt(1780)).toBe("1.8k");
  });
});

describe("tk", () => {
  it("never reports zero tokens", () => {
    expect(tk("")).toBe(1);
    expect(tk("a".repeat(36))).toBe(10);
  });
});
