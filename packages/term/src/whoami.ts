import type { Command } from "./registry.ts";

export const whoami: Command = {
  name: "whoami",
  help: "who runs this thing",
  run: () => ["Janis Schubert", "Software developer from Mainz. Backend mostly, frontend when nobody else will."],
};
