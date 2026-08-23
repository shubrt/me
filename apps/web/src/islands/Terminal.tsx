import {
  createInitialState,
  menuList,
  menuQuery,
  prepareData,
  reduce,
  resolve,
  statusRow,
  contextUsage,
  type Row,
  type SessionData,
} from "@shubrt/session";
import type { Repo, WhoamiGroup } from "@shubrt/contracts";
import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

type Props = {
  repos: Repo[];
  whoami: WhoamiGroup[];
  /** Rolled at build time so server HTML and hydration agree on the context fill. */
  seed: number;
  children?: ReactNode;
};

// The only island: renders rows, translates events into actions, and drives
// the step timers. All run logic lives in @shubrt/session.
export default function Terminal({ repos, whoami, seed, children }: Props) {
  const data: SessionData = useMemo(() => prepareData({ repos, whoami }), [repos, whoami]);
  const [state, dispatch] = useReducer(reduce, undefined, () =>
    createInitialState(data, {
      rng: () => seed,
      reduceMotion:
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    }),
  );

  const sessionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stick = useRef(true);

  const submit = (value: string) => {
    if (!value.trim()) return;
    dispatch({ type: "submit", value });
    const job = resolve(value, data);
    if (job) {
      stick.current = true;
      dispatch({ type: "runStarted", job });
    }
    inputRef.current?.focus();
  };

  // Timers for the active job: one timeout chain for the steps, one 130ms
  // interval for the live counter. A queued job re-triggers this effect.
  useEffect(() => {
    const job = state.active;
    if (!job) return;
    const t0 = Date.now();
    const interval = window.setInterval(
      () => dispatch({ type: "runTick", elapsedMs: Date.now() - t0 }),
      130,
    );
    let timeout = 0;
    let i = 0;
    const step = () => {
      const planned = job.steps[i];
      if (!planned) {
        window.clearInterval(interval);
        // Reported time never exceeds the plan, throttled tabs included.
        const seconds = Math.min((Date.now() - t0) / 1000, job.durationMs / 1000);
        dispatch({ type: "runFinished", job, seconds });
        return;
      }
      const stepIndex = i;
      i += 1;
      timeout = window.setTimeout(() => {
        dispatch({ type: "runStep", job, stepIndex });
        step();
      }, planned.delayMs);
    };
    step();
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [state.active]);

  // Follow the bottom while the user has not scrolled up.
  useEffect(() => {
    const el = sessionRef.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [state.rows]);

  useEffect(() => {
    inputRef.current?.focus();

    // Typing anywhere lands in the composer, like a real terminal. Never
    // steal keys from focused buttons or links.
    const onDocKey = (ev: KeyboardEvent) => {
      const input = inputRef.current;
      if (!input || ev.target === input) return;
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
      const target = ev.target instanceof Element ? ev.target : null;
      if (target?.closest("button, a, input, textarea")) return;
      if (ev.key.length === 1 || ev.key === "Backspace") input.focus();
    };

    // The profile chips and the static social buttons live outside React's
    // tree, so both are handled by delegation.
    const onDocClick = (ev: MouseEvent) => {
      const target = ev.target instanceof Element ? ev.target : null;
      const chip = target?.closest("[data-cmd]");
      if (chip) {
        const name = chip.getAttribute("data-cmd") ?? "";
        dispatch({ type: "input", value: name, caret: name.length });
        inputRef.current?.focus();
        return;
      }
      const social = target?.closest("[data-social]");
      if (social) {
        stick.current = true;
        dispatch({
          type: "note",
          row: statusRow(`${social.getAttribute("data-social")} link not set yet`),
        });
      }
    };

    document.addEventListener("keydown", onDocKey);
    document.addEventListener("click", onDocClick);
    return () => {
      document.removeEventListener("keydown", onDocKey);
      document.removeEventListener("click", onDocClick);
    };
  }, []);

  const list = menuList(state, data);
  const selected = Math.min(state.menuIndex, Math.max(0, list.length - 1));

  const onKeyDown = (ev: ReactKeyboardEvent<HTMLInputElement>) => {
    if (list.length) {
      if (ev.key === "ArrowDown") {
        ev.preventDefault();
        dispatch({ type: "menuMove", delta: 1 });
        return;
      }
      if (ev.key === "ArrowUp") {
        ev.preventDefault();
        dispatch({ type: "menuMove", delta: -1 });
        return;
      }
      if (ev.key === "Escape") {
        ev.preventDefault();
        dispatch({ type: "menuDismiss" });
        return;
      }
      if (ev.key === "Tab") {
        ev.preventDefault();
        dispatch({ type: "menuComplete" });
        return;
      }
      if (ev.key === "Enter") {
        ev.preventDefault();
        const cmd = list[selected];
        if (cmd) submit(cmd.name);
        return;
      }
    }
    if (ev.key === "Enter") {
      ev.preventDefault();
      submit(state.input);
    }
  };

  const onCaret = (ev: { currentTarget: HTMLInputElement }) => {
    dispatch({ type: "caret", caret: ev.currentTarget.selectionStart ?? 0 });
  };

  const usage = contextUsage(state.tokens);
  const query = menuQuery(state.input) ?? "";

  return (
    <>
      <div
        className="session"
        ref={sessionRef}
        onScroll={() => {
          const el = sessionRef.current;
          if (el) stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
        }}
      >
        <div className="log">
          {state.rows.map((row, i) => renderRow(row, i, state.busy, children))}
        </div>
      </div>

      <div className="terminal-bottom">
        {list.length > 0 && (
          <div className="cmd-menu">
            {list.map((cmd, i) => {
              const bare = cmd.name.slice(1);
              const at = query ? bare.indexOf(query) : -1;
              const on = i === selected;
              return (
                <button
                  type="button"
                  key={cmd.name}
                  className={on ? "cmd-row cmd-row-sel" : "cmd-row"}
                  onMouseDown={(ev) => {
                    ev.preventDefault();
                    submit(cmd.name);
                  }}
                >
                  <span className={on ? "cmd-name-sel" : "cmd-row-name"}>
                    /{at === -1 ? bare : bare.slice(0, at)}
                    {at !== -1 && (
                      <span className="cmd-hit">{bare.slice(at, at + query.length)}</span>
                    )}
                    {at !== -1 && bare.slice(at + query.length)}
                  </span>
                  <span className={on ? "cmd-desc-sel" : "cmd-row-desc"}>{cmd.description}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="composer-row">
          <div className="composer">
            <span className="prompt-marker">›</span>
            <div className="input-wrap">
              <span className="cursor" style={{ left: `${state.caret}ch` }} />
              <input
                className={state.input === "" ? "composer-input is-empty" : "composer-input"}
                type="text"
                autoComplete="off"
                spellCheck={false}
                aria-label="Ask the agent"
                placeholder="Ask a question or type / for commands"
                ref={inputRef}
                value={state.input}
                onChange={(ev) =>
                  dispatch({
                    type: "input",
                    value: ev.target.value,
                    caret: ev.target.selectionStart ?? ev.target.value.length,
                  })
                }
                onKeyDown={onKeyDown}
                onKeyUp={onCaret}
                onSelect={onCaret}
                onClick={onCaret}
              />
            </div>
          </div>
          <aside className="context-window">
            <span className="context-label">context</span>
            <span className="context-meter">
              <span className="context-fill" style={{ width: `${usage.pct.toFixed(1)}%` }} />
            </span>
            <span className="context-usage">{usage.label}</span>
          </aside>
        </div>
      </div>
    </>
  );
}

function renderRow(row: Row, key: number, busy: boolean, children: ReactNode) {
  switch (row.kind) {
    case "profile":
      // The panel markup comes as static children from Astro; the busy flag
      // reaches the antenna via the descendant selector `.is-busy .g-ant`.
      return (
        <div key={key} className={busy ? `${row.cls} is-busy` : row.cls}>
          {children}
        </div>
      );

    case "command":
      return (
        <div key={key} className={row.cls}>
          <div className="terminal-line command-line">
            <span className="line-marker mk-white">›</span>
            <span className="cmd-label">{row.label}</span>
            <span className="command-stats">{row.stats}</span>
          </div>
        </div>
      );

    case "pending":
      return (
        <div key={key} className={row.cls}>
          <div className="terminal-line">
            <span className="line-marker mk-accent">{row.glyph}</span>
            <span className="pending-label">
              Cooking… <span className="tx-dim">{row.elapsed}</span>
            </span>
          </div>
        </div>
      );

    case "line":
      return (
        <div key={key} className={row.cls}>
          <div className="terminal-line">
            <span className={row.mkCls}>{row.marker}</span>
            <span className={row.txCls}>{row.text}</span>
          </div>
        </div>
      );

    case "tool":
      return (
        <div key={key} className={row.cls}>
          <div className="terminal-line">
            <span className="line-marker mk-tool">⏺</span>
            <span className="tx-tool">
              {row.title} <span className="tx-arg">{row.arg}</span>
            </span>
          </div>
        </div>
      );

    case "group":
      return (
        <div key={key} className={row.cls}>
          <div className="terminal-line">
            <span className="line-marker mk-accent">●</span>
            <span className="grp-title">{row.title}</span>
          </div>
        </div>
      );

    case "kv":
      return (
        <div key={key} className={row.cls}>
          <div className="terminal-line">
            <span className={row.mkCls}>{row.marker}</span>
            <span className={row.rowCls}>
              <span className="kv-key">{row.k}</span>
              <span className={row.valCls}>{row.v}</span>
            </span>
          </div>
        </div>
      );

    case "repoHead":
      return (
        <div key={key} className={row.cls}>
          <div className="terminal-line">
            <span className="line-marker mk-dim" />
            <span className="repo-hd">
              <span />
              <span>repo</span>
              <span>52w</span>
              <span>stars</span>
              <span className="rp-lang">lang</span>
              <span className="rp-push">push</span>
            </span>
          </div>
        </div>
      );

    case "repo":
      return (
        <div key={key} className={row.cls}>
          <div className="terminal-line">
            <span className={row.mkCls}>{row.marker}</span>
            <a className="repo-row" href={row.url} target="_blank" rel="noopener noreferrer">
              <span className="rp-idx">{row.id}</span>
              <span className="rp-name">
                {row.name} <span className="rp-ext">↗</span>
              </span>
              <span className="rp-act">{row.act}</span>
              <span className="rp-meta rp-stars">{row.stars}</span>
              <span className="rp-meta rp-lang">{row.lang}</span>
              <span className="rp-meta rp-push">{row.push}</span>
            </a>
          </div>
        </div>
      );

    case "file":
      return (
        <div key={key} className={row.cls}>
          <div className="terminal-line">
            <span className={row.mkCls}>{row.marker}</span>
            <span className="file-row">
              <span className="file-name">{row.name}</span>
              <span className="file-size">{row.size}</span>
              <span className="file-mtime">{row.mtime}</span>
            </span>
          </div>
        </div>
      );

    case "commandRow":
      return (
        <div key={key} className={row.cls}>
          <div className="terminal-line">
            <span className={row.mkCls}>{row.marker}</span>
            <span className="cmdtable-row">
              <span className="cmdtable-name">{row.name}</span>
              <span className="cmdtable-desc">{row.desc}</span>
            </span>
          </div>
        </div>
      );
  }
}
