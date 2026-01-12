import type { Content } from "./content.ts";
import type { Command } from "./registry.ts";

export function uses(content: Content): Command {
  return { name: "uses", help: "tools I work with", run: () => content.uses };
}
