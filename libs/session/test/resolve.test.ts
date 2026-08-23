import { describe, expect, it } from "vite-plus/test";

import { resolve, toolCount } from "@shubrt/session";
import { makeData, mulberry32, rngOf } from "./helpers.ts";

const data = makeData(rngOf(0.5));

describe("resolve", () => {
  it("builds a /whoami job with tool steps and plausible output", () => {
    const job = resolve("/whoami", data, rngOf(0.5));
    expect(job).not.toBeNull();
    if (!job) return;

    expect(job.label).toBe("/whoami");
    expect(job.steps.some((s) => s.kind === "tool")).toBe(true);
    expect(job.out).toBeGreaterThanOrEqual(80);
    expect(job.out).toBeLessThanOrEqual(400);
  });

  it("keeps every duration between 2200 and 4600 ms over 200 seeded runs", () => {
    const rng = mulberry32(1234);
    for (let run = 0; run < 200; run++) {
      for (const name of ["/whoami", "/projects", "/help"]) {
        const job = resolve(name, data, rng);
        expect(job).not.toBeNull();
        if (!job) continue;

        const sum = job.steps.reduce((n, s) => n + s.delayMs, 0);
        expect(job.durationMs).toBe(sum);
        expect(job.durationMs).toBeGreaterThanOrEqual(2200);
        expect(job.durationMs).toBeLessThanOrEqual(4600);
      }
    }
  });

  it("rolls the optional /whoami read deterministically", () => {
    // First rng() decides the chance-0.4 step, the next one the duration.
    const kept = resolve("/whoami", data, rngOf(0.1, 0.5));
    expect(kept).not.toBeNull();
    if (kept) expect(toolCount(kept)).toBe(2);

    const dropped = resolve("/whoami", data, rngOf(0.9, 0.5));
    expect(dropped).not.toBeNull();
    if (dropped) expect(toolCount(dropped)).toBe(1);
  });

  it("answers unknown commands with an error and a hint", () => {
    const job = resolve("/nope", data, rngOf(0.5));
    expect(job).not.toBeNull();
    if (!job) return;

    expect(job.steps.some((s) => s.kind === "error")).toBe(true);
    expect(job.steps.some((s) => s.kind === "hint")).toBe(true);
    expect(job.out).toBeLessThan(40);
  });
});
