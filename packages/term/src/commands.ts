import type { Content } from "./content.ts";
import type { Command, Registry } from "./registry.ts";

export function help(registry: Registry): Command {
  return {
    name: "help",
    help: "list the available commands",
    run: () => registry.list().map((c) => `${c.name.padEnd(10)} ${c.help}`),
  };
}

export const whoami: Command = {
  name: "whoami",
  help: "who runs this thing",
  run: () => ["Janis Schubert", "Software developer from Mainz. Backend mostly, frontend when nobody else will."],
};

export const clear: Command = { name: "clear", help: "clear the screen", run: () => [] };

/** Side effects live in the UI. The command only says what should happen. */
export const theme: Command = {
  name: "theme",
  help: "theme dark|light",
  run: (args) => {
    const want = args[0];
    if (want !== "dark" && want !== "light") return ["usage: theme dark|light"];
    return [`theme: ${want}`];
  },
};

const links: Record<string, string> = {
  github: "https://github.com/shubrt",
  mail: "mailto:shubrt.me@gmail.com",
  notes: "/notes",
  rss: "/notes/rss.xml",
};

export const open: Command = {
  name: "open",
  help: `open ${Object.keys(links).join("|")}`,
  run: (args) => {
    const target = links[args[0] ?? ""];
    return target ? [`open: ${target}`] : [`open: unknown target. Try ${Object.keys(links).join(", ")}.`];
  },
};

export function projects(content: Content): Command {
  return {
    name: "projects",
    help: "things I build",
    run: () => {
      const width = Math.max(...content.projects.map((p) => p.name.length), 4) + 2;
      return content.projects.map((p) => {
        const meta = [p.stars !== undefined ? `★ ${p.stars}` : null, p.pushedAt ? `pushed ${p.pushedAt.slice(0, 10)}` : null].filter(Boolean).join("  ");
        return `${p.name.padEnd(width)}${p.description}${meta ? `  ${meta}` : ""}`;
      });
    },
  };
}

export function notes(content: Content): Command {
  return {
    name: "notes",
    help: "latest notes, notes <n> for more",
    run: (args) => {
      const n = Number(args[0] ?? 5);
      return content.notes.slice(0, Number.isFinite(n) && n > 0 ? n : 5).map((x) => `${x.date}  ${x.title}  ${x.url}`);
    },
  };
}

export function uses(content: Content): Command {
  return { name: "uses", help: "tools I work with", run: () => content.uses };
}

export function now(content: Content): Command {
  return { name: "now", help: "what I am up to", run: () => content.now };
}
