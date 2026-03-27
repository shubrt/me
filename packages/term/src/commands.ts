import type { Content } from "./content.ts";
import { blocks } from "./format.ts";
import { CommandError, type Command, type Registry } from "./registry.ts";

export function help(registry: Registry): Command {
  return {
    name: "help",
    help: "list the available commands",
    run: () =>
      registry.list().map((c) => {
        const aliases = registry.aliasesOf(c.name);
        return `${c.name.padEnd(10)} ${c.help}${aliases.length ? `  (also: ${aliases.join(", ")})` : ""}`;
      }),
  };
}

export const whoami: Command = {
  name: "whoami",
  help: "who runs this thing",
  run: () => ["Janis Schubert", "Software developer from Mainz. Backend mostly, frontend when nobody else will."],
};

export const clear: Command = { name: "clear", help: "clear the screen", run: () => [] };

export const sudo: Command = {
  name: "sudo",
  help: "no",
  run: (args) => [`${args[0] ?? "sudo"}: permission denied. This incident will not be reported, nobody is watching.`],
};

export const exit: Command = {
  name: "exit",
  help: "leave",
  run: () => ["There is no exit. This is a website. Close the tab, or type help."],
};

export function version(v: string): Command {
  return { name: "version", help: "which build is this", run: () => [`shubrt.me ${v}`] };
}

/** Side effects live in the UI. The command only says what should happen. */
export const theme: Command = {
  name: "theme",
  help: "theme dark|light",
  run: (args) => {
    const want = args[0];
    if (want !== "dark" && want !== "light") throw new CommandError("usage: theme dark|light");
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
    if (!target) throw new CommandError(`unknown target. Try ${Object.keys(links).join(", ")}.`);
    return [`open: ${target}`];
  },
};

export function projects(content: Content): Command {
  return {
    name: "projects",
    help: "things I build",
    run: () => {
      const width = Math.max(...content.projects.map((p) => p.name.length), 4) + 2;
      const max = Math.max(0, ...content.projects.flatMap((p) => p.activity ?? []));
      return content.projects.map((p) => {
        const spark = p.activity ? `${blocks(p.activity, max)}  ` : "";
        const meta = [p.stars !== undefined ? `★ ${p.stars}` : null, p.pushedAt ? `pushed ${p.pushedAt.slice(0, 10)}` : null].filter(Boolean).join("  ");
        return `${p.name.padEnd(width)}${spark}${p.description}${meta ? `  ${meta}` : ""}`;
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
