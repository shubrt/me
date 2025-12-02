import type { Content } from "./content.ts";
import type { Command } from "./registry.ts";

export function projects(content: Content): Command {
  return {
    name: "projects",
    help: "things I build",
    run: () => content.projects.map((p) => `${p.name.padEnd(12)} ${p.description}${p.url ? `  ${p.url}` : ""}`),
  };
}
