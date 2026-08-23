import { tk } from "./format.ts";
import type { SessionData, Step } from "./registry.ts";

/** The model's context window, as shown in the status bar. */
export const CONTEXT_LIMIT = 250_000;

/**
 * Tokens the model "wrote" for a step: this is the number that streams live
 * and that the turn reports. Every rendered line carries three to four
 * tokens of structural cost on top of its text.
 */
export function outTokens(step: Step, data: SessionData): number {
  switch (step.kind) {
    case "tool":
      return 34;
    case "text":
      return step.lines.reduce((n, l) => n + tk(l) + 3, 0);
    case "groups":
      return step.groups.reduce(
        (n, g) => n + tk(g.title) + 3 + g.rows.reduce((m, [k, v]) => m + tk(k + v) + 4, 0),
        0,
      );
    case "repos":
      return 14 + data.repos.reduce((n, r) => n + tk(r.name + r.language + r.pushedLabel) + 16, 0);
    case "kv":
      return step.rows.reduce((n, [k, v]) => n + tk(k + v) + 4, 0);
    case "files":
      return step.rows.reduce((n, f) => n + tk(f.join(" ")) + 4, 0);
    case "commandTable":
      return data.commands.reduce((n, c) => n + tk(c.name + c.description) + 4, 0);
    case "hint":
    case "status":
    case "error":
      return tk(step.text) + 3;
    default:
      return 6;
  }
}

/**
 * Tokens a tool handed back. Never rendered, they only fill the context.
 * File reads scale with the reported line count.
 */
export function resTokens(step: Step): number {
  if (step.kind !== "tool") return 0;
  if (step.result !== undefined) return step.result;
  const hit = /(\d+)\s+lines/.exec(step.meta ?? "");
  return hit ? Number(hit[1]) * 11 : 120;
}
