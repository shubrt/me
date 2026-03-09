import { describe, expect, it } from "vitest";
import { initial, reduce } from "./reducer.ts";
import { Registry } from "./registry.ts";

const registry = new Registry().register({ name: "echo", help: "repeat", run: (args) => [args.join(" ")] });

describe("reduce", () => {
  it("echoes the input line and appends the output", () => {
    let s = reduce(initial, { type: "type", value: "echo hi there" }, registry);
    s = reduce(s, { type: "submit" }, registry);
    expect(s.input).toBe("");
    expect(s.lines).toEqual([
      { kind: "input", text: "echo hi there" },
      { kind: "output", text: "hi there" },
      { kind: "meta", text: "1 lines · 0.0 ms" },
    ]);
  });

  it("reports unknown commands by name", () => {
    const s = reduce({ ...initial, input: "nope" }, { type: "submit" }, registry);
    expect(s.lines.at(-1)).toEqual({ kind: "error", text: "nope: command not found. Try help." });
  });

  it("clear drops the lines but keeps the input", () => {
    const s = reduce({ lines: [{ kind: "output", text: "x" }], input: "abc" }, { type: "clear" }, registry);
    expect(s).toEqual({ lines: [], input: "abc" });
  });
});
