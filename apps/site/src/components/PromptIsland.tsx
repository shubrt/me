import { useEffect, useReducer, useRef } from "react";
import { type Action, type State, Registry, help, initial, reduce, whoami } from "@shubrt/term";

const registry = new Registry().register(whoami);
registry.register(help(registry));

export default function Prompt() {
  const [state, dispatch] = useReducer((s: State, a: Action) => reduce(s, a, registry), initial);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="mt-8">
      <div className="space-y-0.5 text-sm" aria-live="polite">
        {state.lines.map((l, i) => (
          <p key={i} className={l.kind === "input" ? "text-neutral-500" : l.kind === "error" ? "text-red-600 dark:text-red-400" : ""}>
            {l.kind === "input" ? `$ ${l.text}` : l.text}
          </p>
        ))}
      </div>
      <form
        className="mt-2 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({ type: "submit" });
        }}
      >
        <label htmlFor="term-in" className="select-none text-neutral-500">
          $
        </label>
        <input
          ref={input}
          id="term-in"
          value={state.input}
          onChange={(e) => dispatch({ type: "type", value: e.target.value })}
          autoComplete="off"
          spellCheck={false}
          className="w-full bg-transparent outline-none"
          placeholder="type help"
        />
      </form>
    </div>
  );
}
