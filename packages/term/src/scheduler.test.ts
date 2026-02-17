import { describe, expect, it } from "vitest";
import { createScheduler } from "./scheduler.ts";

describe("createScheduler", () => {
  it("emits everything at once with delay 0", () => {
    const out: string[] = [];
    const s = createScheduler((l) => out.push(l.text), { delay: 0 });
    s.push([{ kind: "output", text: "a" }, { kind: "output", text: "b" }]);
    expect(out).toEqual(["a", "b"]);
    expect(s.pending()).toBe(0);
  });

  it("emits one line per tick otherwise", () => {
    const out: string[] = [];
    const timers: Array<() => void> = [];
    const s = createScheduler((l) => out.push(l.text), { delay: 20, setTimeout: (fn) => timers.push(fn) });
    s.push([{ kind: "output", text: "a" }, { kind: "output", text: "b" }]);
    expect(out).toEqual(["a"]);
    timers.shift()?.();
    expect(out).toEqual(["a", "b"]);
  });
});
