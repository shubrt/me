import type { Command, Registry } from "./registry.ts";

export function help(registry: Registry): Command {
  return {
    name: "help",
    help: "list the available commands",
    run: () => registry.list().map((c) => `${c.name.padEnd(10)} ${c.help}`),
  };
}
