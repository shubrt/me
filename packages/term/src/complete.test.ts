import { describe, expect, it } from "vitest";
import { complete } from "./complete.ts";

const names = ["help", "history", "whoami", "clear"];

describe("complete", () => {
  it("completes a unique prefix", () => {
    expect(complete("wh", names).value).toBe("whoami ");
  });

  it("extends to the common prefix when ambiguous", () => {
    expect(complete("h", names)).toEqual({ value: "h", candidates: ["help", "history"] });
    expect(complete("he", names).value).toBe("help ");
  });

  it("leaves unknown input alone", () => {
    expect(complete("x", names)).toEqual({ value: "x", candidates: [] });
  });
});
