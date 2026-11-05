import { fmt, round100, tk } from "../helper/format.ts";
import type { CommandMeta, Rng, SessionData, Step } from "./registry.ts";
import { commandRow, cookedRow, expandStep, pendingRow, type Row } from "./rows.ts";
import { CONTEXT_LIMIT, outTokens, resTokens } from "./tokens.ts";

/** A step with its scheduled delay, ready to play back deterministically. */
export type PlannedStep = Step & { delayMs: number };

/**
 * A fully prepared run: optional steps already decided, delays scaled to a
 * rolled target duration, token totals computed. Deterministic to replay.
 */
export type Job = {
  label: string;
  steps: PlannedStep[];
  /** Tokens the model wrote; streams live and is reported by the turn. */
  out: number;
  /** Tokens tools returned; invisible, fills the context. */
  res: number;
  /** Cost of the user's input line. */
  input: number;
  durationMs: number;
};

export type SessionState = {
  rows: Row[];
  input: string;
  caret: number;
  menuIndex: number;
  dismissed: boolean;
  /** Context fill, monotonically increasing, never reset. */
  tokens: number;
  busy: boolean;
  /** Jobs submitted while busy wait here and start after runFinished. */
  queue: Job[];
  /** The job currently playing; the island drives its timers. */
  active: Job | null;
  /** Honors prefers-reduced-motion: freezes the pending glyph. */
  reduceMotion: boolean;
  data: SessionData;
};

export type SessionAction =
  | { type: "input"; value: string; caret: number }
  | { type: "caret"; caret: number }
  | { type: "menuMove"; delta: number }
  | { type: "menuDismiss" }
  | { type: "menuComplete" }
  | { type: "submit"; value: string }
  | { type: "runStarted"; job: Job }
  | { type: "runStep"; job: Job; stepIndex: number }
  | { type: "runTick"; elapsedMs: number }
  | { type: "runFinished"; job: Job; seconds: number }
  | { type: "note"; row: Row };

export function createInitialState(
  data: SessionData,
  options: { rng?: Rng; reduceMotion?: boolean } = {},
): SessionState {
  const rng = options.rng ?? Math.random;
  return {
    rows: [{ kind: "profile", cls: "slot" }],
    input: "",
    caret: 0,
    menuIndex: 0,
    dismissed: false,
    // System prompt plus tool definitions are already in the context.
    tokens: round100(11200 + rng() * 2600),
    busy: false,
    queue: [],
    active: null,
    reduceMotion: options.reduceMotion ?? false,
    data,
  };
}

export function reduce(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "input": {
      // Escape only stays in effect while the same slash word is being edited.
      const isStillDismissed =
        action.value.startsWith("/") && action.value !== "/" ? state.dismissed : false;
      return {
        ...state,
        input: action.value,
        caret: action.caret,
        menuIndex: 0,
        dismissed: isStillDismissed,
      };
    }

    case "caret":
      return action.caret === state.caret ? state : { ...state, caret: action.caret };

    case "menuMove": {
      const list = menuList(state, state.data);
      if (!list.length) return state;
      const index = Math.min(state.menuIndex, list.length - 1);
      return { ...state, menuIndex: (index + action.delta + list.length) % list.length };
    }

    case "menuDismiss":
      return { ...state, dismissed: true };

    case "menuComplete": {
      const list = menuList(state, state.data);
      const selected = list[Math.min(state.menuIndex, list.length - 1)];
      if (!selected) return state;
      return { ...state, input: selected.name, caret: selected.name.length, menuIndex: 0 };
    }

    case "submit":
      if (!action.value.trim()) return state;
      return { ...state, input: "", caret: 0, menuIndex: 0, dismissed: false };

    case "runStarted":
      if (state.busy) return { ...state, queue: [...state.queue, action.job] };
      return {
        ...state,
        rows: appendJobRows(state.rows, action.job),
        busy: true,
        active: action.job,
        dismissed: false,
        menuIndex: 0,
      };

    case "runStep": {
      if (action.job !== state.active) return state;
      const step = action.job.steps[action.stepIndex];
      if (!step) return state;
      const expanded = expandStep(step, state.data);
      // New output goes above the pending line, never after it.
      const at = state.rows.findIndex((r) => r.kind === "pending");
      const rows =
        at === -1
          ? [...state.rows, ...expanded]
          : [...state.rows.slice(0, at), ...expanded, ...state.rows.slice(at)];
      return { ...state, rows };
    }

    case "runTick": {
      const active = state.active;
      if (!active) return state;
      const rows = state.rows.map((r) =>
        r.kind === "pending"
          ? {
              ...r,
              glyph: pendingGlyph(action.elapsedMs, state.reduceMotion),
              elapsed: pendingElapsed(active, action.elapsedMs),
            }
          : r,
      );
      return { ...state, rows };
    }

    case "runFinished": {
      const { job: finished, seconds } = action;
      const stats = `${fmt(finished.out)} tok / ${seconds.toFixed(1)}s`;

      // The finished job owns the only command row still without stats.
      const statsAt = state.rows.findLastIndex((r) => r.kind === "command" && r.stats === "");

      let rows: Row[] = state.rows
        .map((r, i) => (i === statsAt && r.kind === "command" ? { ...r, stats } : r))
        .filter((r) => r.kind !== "pending");
      rows = [...rows, cookedRow(finished.out, seconds, toolCount(finished))];

      const tokens = state.tokens + finished.out + finished.res + finished.input;

      const [next, ...rest] = state.queue;
      if (next) {
        return {
          ...state,
          rows: appendJobRows(rows, next),
          tokens,
          queue: rest,
          active: next,
          busy: true,
        };
      }
      return { ...state, rows, tokens, queue: [], active: null, busy: false };
    }

    case "note":
      return { ...state, rows: [...state.rows, action.row] };
  }
}

function appendJobRows(rows: Row[], job: Job): Row[] {
  return [...rows, commandRow(job.label), pendingRow()];
}

/**
 * Turns raw composer input into a prepared Job: slash commands, free-text
 * answers, or the fallback. Returns null for blank input.
 */
export function resolve(input: string, data: SessionData, rng: Rng = Math.random): Job | null {
  const value = input.trim();
  if (!value) return null;

  if (value.startsWith("/")) {
    const name = (value.split(/\s+/)[0] ?? value).toLowerCase();
    const command = data.commands.find((c) => c.name === name);
    if (command) return buildJob(command.name, command.steps, data, rng);

    return buildJob(
      value,
      [
        { kind: "error", text: `unknown command ${name}` },
        { kind: "hint", text: `available: ${data.commands.map((c) => c.name).join(" ")}` },
      ],
      data,
      rng,
    );
  }

  const lower = value.toLowerCase();
  for (const answer of data.answers) {
    if (answer.match.some((m) => lower.includes(m))) {
      return buildJob(value, answer.steps, data, rng);
    }
  }

  return buildJob(
    value,
    [
      {
        kind: "tool",
        title: rng() < 0.5 ? "Search" : "Grep",
        arg: "~/dev",
        meta: "No local match",
        result: 40,
      },
      { kind: "text", lines: ["Nothing local answers that yet."] },
      { kind: "hint", text: "try /whoami, /projects or /help" },
    ],
    data,
    rng,
  );
}

// Relative base weights per step kind; scaled to hit the rolled duration.
const WEIGHTS: Record<Step["kind"], number> = {
  tool: 340,
  groups: 360,
  repos: 380,
  kv: 280,
  text: 300,
  files: 280,
  commandTable: 260,
  hint: 100,
  status: 120,
  error: 240,
};

function buildJob(label: string, flow: Step[], data: SessionData, rng: Rng): Job {
  // Optional steps are decided first, so duration and tokens match what plays.
  const kept = flow.filter((s) => s.kind !== "tool" || s.chance === undefined || rng() < s.chance);

  const target = Math.round(2200 + rng() * 2400);
  const total = Math.max(
    1,
    kept.reduce((n, s) => n + WEIGHTS[s.kind], 0),
  );
  const steps: PlannedStep[] = kept.map((s) => ({
    ...s,
    delayMs: Math.max(120, Math.round((WEIGHTS[s.kind] * target) / total)),
  }));
  // Push rounding drift onto the last step so the sum hits the target exactly.
  const last = steps[steps.length - 1];
  if (last) {
    const sum = steps.reduce((n, s) => n + s.delayMs, 0);
    last.delayMs = Math.max(120, last.delayMs + target - sum);
  }

  let out = 0;
  let res = 0;
  for (const s of steps) {
    out += outTokens(s, data);
    res += resTokens(s);
  }

  return {
    label,
    steps,
    out,
    res,
    input: tk(label) + 8,
    durationMs: steps.reduce((n, s) => n + s.delayMs, 0),
  };
}

export function toolCount(job: Job): number {
  return job.steps.filter((s) => s.kind === "tool").length;
}

/** The active menu filter, or null when the input is not a bare "/name". */
export function menuQuery(input: string): string | null {
  if (!input.startsWith("/") || /\s/.test(input)) return null;
  return input.slice(1).toLowerCase();
}

export function menuList(state: SessionState, data: SessionData): CommandMeta[] {
  const query = menuQuery(state.input);
  if (query === null || state.dismissed) return [];
  return data.commands.filter((c) => c.name.slice(1).includes(query));
}

const GLYPHS = ["✳", "✻", "✽", "✻"];

export function pendingGlyph(elapsedMs: number, shouldReduceMotion: boolean): string {
  const index = shouldReduceMotion ? 0 : Math.floor(elapsedMs / 130) % GLYPHS.length;
  return GLYPHS[index] ?? "✳";
}

export function pendingElapsed(job: Job, elapsedMs: number): string {
  const ms = Math.min(elapsedMs, job.durationMs);
  const streamed = Math.min(job.out, Math.round((job.out * ms) / job.durationMs));
  return `(${Math.floor(ms / 1000)}s · ↓ ${streamed} tokens)`;
}

export function contextUsage(tokens: number): { label: string; pct: number } {
  const pct = Math.min(100, (tokens / CONTEXT_LIMIT) * 100);
  return { label: `${fmt(tokens)} (${Math.round(pct)}%)`, pct };
}
