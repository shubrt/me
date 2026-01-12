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

export function projects(content: Content): Command {
  return {
    name: "projects",
    help: "things I build",
    run: () => content.projects.map((p) => `${p.name.padEnd(12)} ${p.description}${p.url ? `  ${p.url}` : ""}`),
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
