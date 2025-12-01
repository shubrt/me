import { describe, expect, it } from "vitest";
import { History } from "./history.ts";

describe("History", () => {
  it("walks back and forward", () => {
    const h = new History();
    h.push("help");
    h.push("whoami");
    expect(h.back()).toBe("whoami");
    expect(h.back()).toBe("help");
    expect(h.back()).toBeUndefined();
    expect(h.forward()).toBe("whoami");
    expect(h.forward()).toBe("");
  });

  it("does not store the same line twice in a row", () => {
    const h = new History();
    h.push("help");
    h.push("help");
    expect(h.all()).toEqual(["help"]);
  });

  it("ignores blank lines", () => {
    const h = new History();
    h.push("   ");
    expect(h.all()).toEqual([]);
  });
});
