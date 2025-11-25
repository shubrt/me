import { describe, expect, it } from "vitest";
import { parse } from "./parse.ts";

describe("parse", () => {
  it("splits name and args", () => {
    expect(parse("open github")).toEqual({ name: "open", args: ["github"] });
  });

  it("groups quoted words", () => {
    expect(parse('echo "hello there" you')).toEqual({ name: "echo", args: ["hello there", "you"] });
  });

  it("returns null for empty input", () => {
    expect(parse("   ")).toBeNull();
  });

  it("lowercases the command name only", () => {
    expect(parse("Open GitHub")).toEqual({ name: "open", args: ["GitHub"] });
  });
});
