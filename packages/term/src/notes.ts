import type { Content } from "./content.ts";
import type { Command } from "./registry.ts";

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
