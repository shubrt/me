import type { Content } from "./content.ts";
import type { Command } from "./registry.ts";

export function now(content: Content): Command {
  return { name: "now", help: "what I am up to", run: () => content.now };
}
