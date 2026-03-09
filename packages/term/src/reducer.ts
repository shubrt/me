import { parse } from "./parse.ts";
import type { Registry } from "./registry.ts";

export interface Line {
  kind: "input" | "output" | "error" | "meta";
  text: string;
}

export interface State {
  lines: Line[];
  input: string;
}

export type Action = { type: "type"; value: string } | { type: "submit"; now?: () => number } | { type: "clear" };

export const initial: State = { lines: [], input: "" };

export function reduce(state: State, action: Action, registry: Registry): State {
  switch (action.type) {
    case "type":
      return { ...state, input: action.value };
    case "clear":
      return { ...state, lines: [] };
    case "submit": {
      const parsed = parse(state.input);
      if (!parsed) return { ...state, input: "" };
      const echo: Line = { kind: "input", text: state.input };
      const command = registry.get(parsed.name);
      if (!command) {
        return { lines: [...state.lines, echo, { kind: "error", text: `${parsed.name}: command not found. Try help.` }], input: "" };
      }
      const started = action.now?.() ?? 0;
      const out = command.run(parsed.args).map((text): Line => ({ kind: "output", text }));
      const ms = (action.now?.() ?? 0) - started;
      const meta: Line = { kind: "meta", text: `${out.length} lines · ${ms.toFixed(1)} ms` };
      return { lines: [...state.lines, echo, ...out, meta], input: "" };
    }
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
