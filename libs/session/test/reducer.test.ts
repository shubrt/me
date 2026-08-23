import { describe, expect, it } from "vite-plus/test";

import {
  contextUsage,
  createInitialState,
  pendingElapsed,
  reduce,
  resolve,
  type Row,
} from "@shubrt/session";
import { makeData, mulberry32, rngOf } from "./helpers.ts";

const data = makeData(rngOf(0.5));

const findCommand = (rows: Row[]) =>
  rows.find((r): r is Extract<Row, { kind: "command" }> => r.kind === "command");

describe("reduce run lifecycle", () => {
  it("keeps the pending row last during a run and finishes with a cooked line", () => {
    const rng = mulberry32(7);
    let state = createInitialState(data, { rng });
    const job = resolve("/whoami", data, rng);
    expect(job).not.toBeNull();
    if (!job) return;

    state = reduce(state, { type: "runStarted", job });
    expect(state.rows.at(-1)?.kind).toBe("pending");
    expect(findCommand(state.rows)).toBeDefined();

    const before = state.rows.length;
    state = reduce(state, { type: "runStep", job, stepIndex: 0 });
    expect(state.rows.length).toBeGreaterThan(before);
    expect(state.rows.at(-1)?.kind).toBe("pending");

    state = reduce(state, { type: "runFinished", job, seconds: 3.0 });
    expect(state.rows.some((r) => r.kind === "pending")).toBe(false);
    expect(state.busy).toBe(false);

    const last = state.rows.at(-1);
    expect(last?.kind).toBe("line");
    if (last?.kind === "line") expect(last.text.startsWith("Cooked for")).toBe(true);

    const cmd = findCommand(state.rows);
    expect(cmd).toBeDefined();
    if (cmd) expect(cmd.stats).not.toBe("");
  });

  it("grows the context by out + res + input per finished job", () => {
    const rng = mulberry32(42);
    let state = createInitialState(data, { rng });
    let expected = state.tokens;
    let prev = state.tokens;

    for (const name of ["/whoami", "/projects", "/help"]) {
      const job = resolve(name, data, rng);
      expect(job).not.toBeNull();
      if (!job) return;

      state = reduce(state, { type: "runStarted", job });
      state = reduce(state, { type: "runFinished", job, seconds: 2.5 });

      expect(state.tokens).toBeGreaterThan(prev);
      prev = state.tokens;
      expected += job.out + job.res + job.input;
    }

    expect(state.tokens).toBe(expected);
  });
});

describe("live display helpers", () => {
  it("formats the pending counter and clamps at the full duration", () => {
    const job = resolve("/help", data, rngOf(0.5));
    expect(job).not.toBeNull();
    if (!job) return;

    expect(pendingElapsed(job, 2000)).toMatch(/^\(2s · ↓ \d+ tokens\)$/);
    expect(pendingElapsed(job, job.durationMs + 5000)).toBe(
      `(${Math.floor(job.durationMs / 1000)}s · ↓ ${job.out} tokens)`,
    );
  });

  it("reports context usage as label and percent", () => {
    const usage = contextUsage(25_000);
    expect(usage.pct).toBe(10);
    expect(usage.label).toBe("25.0k (10%)");
  });
});
