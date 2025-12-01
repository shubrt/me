import type { Command } from "./registry.ts";

/** The registry cannot clear a screen it does not have. The UI treats an empty result from clear as a wipe. */
export const clear: Command = { name: "clear", help: "clear the screen", run: () => [] };
