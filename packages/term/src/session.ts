import { clear, help, notes, now, open, projects, theme, uses, whoami } from "./commands.ts";
import type { Content } from "./content.ts";
import { History } from "./history.ts";
import { type Action, type Line, type State, initial, reduce } from "./reducer.ts";
import { Registry } from "./registry.ts";
import { createScheduler } from "./scheduler.ts";

export interface SessionOptions {
  content: Content;
  onChange: (state: State) => void;
  /** 0 for reduced motion. */
  delay?: number;
  registry?: Registry;
}

/** Wires registry, reducer, history and scheduler together. The UI only dispatches. */
export function createSession(options: SessionOptions) {
  const registry = options.registry ?? defaultRegistry(options.content);
  const history = new History();
  let state: State = initial;

  const set = (next: State) => {
    state = next;
    options.onChange(state);
  };
  const scheduler = createScheduler((line: Line) => set({ ...state, lines: [...state.lines, line] }), { delay: options.delay ?? 30 });

  return {
    registry,
    history,
    getState: () => state,
    dispatch(action: Action) {
      if (action.type === "submit") {
        history.push(state.input);
        const before = state.lines.length;
        const next = reduce(state, action, registry);
        // Echo immediately, stream the rest.
        const [echo, ...rest] = next.lines.slice(before);
        set({ ...next, lines: echo ? [...state.lines, echo] : state.lines });
        scheduler.push(rest);
        return;
      }
      set(reduce(state, action, registry));
    },
  };
}

export function defaultRegistry(content: Content): Registry {
  const registry = new Registry();
  registry.register(whoami).register(clear).register(theme).register(open).register(projects(content)).register(notes(content)).register(uses(content)).register(now(content));
  registry.alias("ls", "projects").alias("cat", "whoami");
  registry.register(help(registry));
  return registry;
}
