import type { Repo, WhoamiGroup } from "@shubrt/contracts";

/** Injectable randomness; tests pass a fixed function. */
export type Rng = () => number;

/**
 * One building block of a simulated agent run. `chance` marks optional
 * steps: resolve() keeps them only with the given probability, so the
 * number of tool calls varies from run to run.
 */
export type Step =
  | { kind: "tool"; title: string; arg: string; meta?: string; result?: number; chance?: number }
  | { kind: "text"; lines: string[] }
  | { kind: "groups"; groups: WhoamiGroup[] }
  | { kind: "repos" }
  | { kind: "kv"; rows: [string, string][] }
  | { kind: "files"; rows: [string, string, string][] }
  | { kind: "commandTable" }
  | { kind: "hint"; text: string }
  | { kind: "status"; text: string }
  | { kind: "error"; text: string };

export type CommandMeta = { name: `/${string}`; description: string; steps: Step[] };

/** A free-text answer: first trigger that matches (lowercase includes) wins. */
export type Answer = { match: string[]; steps: Step[] };

/**
 * Everything the terminal core knows. Built once per session by
 * prepareData(); the core has no data source of its own.
 */
export type SessionData = {
  repos: Repo[];
  whoami: WhoamiGroup[];
  commands: CommandMeta[];
  answers: Answer[];
  /** Highest weekly commit count across all repos, scales every activity bar. */
  activityMax: number;
};

/**
 * Bundles repos and whoami groups into SessionData. Line counts and file
 * sizes are rolled once here and stay stable for the whole session, so the
 * same file never reports two different sizes.
 */
export function prepareData(
  input: { repos: Repo[]; whoami: WhoamiGroup[] },
  rng: Rng = Math.random,
): SessionData {
  const { repos, whoami } = input;
  const rolled = {
    whoamiLines: rollInteger(rng, 24, 38),
    nowLines: rollInteger(rng, 12, 20),
    stackLines: rollInteger(rng, 18, 30),
    whoamiSize: rollNumber(rng, 1.2, 2.4).toFixed(1),
    reposSize: rollNumber(rng, 5.8, 9.4).toFixed(1),
    stackSize: rollNumber(rng, 1.1, 2.0).toFixed(1),
  };

  const commands: CommandMeta[] = [
    {
      name: "/whoami",
      description: "Who I am, as structured data",
      steps: [
        {
          kind: "tool",
          title: "Read",
          arg: "~/dev/whoami.json",
          meta: `Read ${rolled.whoamiLines} lines`,
        },
        {
          kind: "tool",
          title: "Read",
          arg: "~/dev/now.md",
          meta: `Read ${rolled.nowLines} lines, cached`,
          chance: 0.4,
        },
        { kind: "groups", groups: whoami },
      ],
    },
    {
      name: "/projects",
      description: "Public repos, sorted by activity",
      steps: [
        {
          kind: "tool",
          title: "Fetch",
          arg: "api.github.com/users/shubrt/repos",
          meta: `${repos.length} public repos, sorted by push`,
          result: 1780,
        },
        {
          kind: "tool",
          title: "Fetch",
          arg: "stats/commit_activity",
          meta: "52 weeks per repo, cached",
          result: 690,
          chance: 0.55,
        },
        { kind: "repos" },
        { kind: "hint", text: "select a row to open the repo on github" },
      ],
    },
    {
      name: "/help",
      description: "List every command in this session",
      steps: [
        { kind: "text", lines: ["Commands are local. Plain questions work too."] },
        { kind: "commandTable" },
        { kind: "hint", text: "type / to open the list, arrows to select, enter to run" },
      ],
    },
  ];

  const offline = whoami.filter((g) => g.title === "offline");

  const answers: Answer[] = [
    {
      match: ["what do you build", "what do you do", "build"],
      steps: [
        { kind: "tool", title: "Search", arg: "~/dev", meta: "Matched 3 files", result: 160 },
        {
          kind: "files",
          rows: [
            ["whoami.json", `${rolled.whoamiSize} kB`, "today"],
            ["repos.cache.json", `${rolled.reposSize} kB`, "2h ago"],
            ["stack.md", `${rolled.stackSize} kB`, "3w ago"],
          ],
        },
        {
          kind: "text",
          lines: [
            "Infrastructure and architecture for the web, mostly typescript.",
            "Currently a lot of automation and ai infrastructure.",
          ],
        },
      ],
    },
    {
      match: ["stack", "tech", "tools", "language"],
      steps: [
        {
          kind: "tool",
          title: "Read",
          arg: "~/dev/stack.md",
          meta: `Read ${rolled.stackLines} lines`,
        },
        {
          kind: "kv",
          rows: [
            ["daily", "typescript, sql"],
            ["runtime", "node, edge functions"],
            ["data", "postgres, sqlite"],
            ["infra", "containers, boring pipelines"],
          ],
        },
      ],
    },
    {
      match: ["available", "hire", "freelance", "work with"],
      steps: [
        {
          kind: "text",
          lines: ["Open to selected work. Architecture reviews and greenfield systems fit best."],
        },
        { kind: "hint", text: "run /whoami for the rest" },
      ],
    },
    {
      match: ["music", "piano", "guitar", "basketball", "sport", "hobby", "offline"],
      steps: [{ kind: "groups", groups: offline.length ? offline : whoami }],
    },
    {
      match: ["who are you", "who is shubrt", "about you", "janis"],
      steps: [
        {
          kind: "text",
          lines: ["Janis Schubert, software architect in mainz. Structured version under /whoami."],
        },
      ],
    },
  ];

  const activityMax = repos.reduce((top, r) => Math.max(top, ...r.activity), 1);

  return { repos, whoami, commands, answers, activityMax };
}

function rollNumber(rng: Rng, min: number, max: number) {
  return min + rng() * (max - min);
}

function rollInteger(rng: Rng, min: number, max: number) {
  return Math.round(rollNumber(rng, min, max));
}
