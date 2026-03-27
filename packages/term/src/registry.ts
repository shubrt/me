/**
 * A command turns arguments into lines of text. Nothing in here knows about
 * HTML, colours or timing. That is deliberate: the same registry should work
 * in a test, in the browser and, one day, in an actual terminal.
 */
export class CommandError extends Error {}

export interface Command {
  name: string;
  help: string;
  /** Throw a CommandError for user-facing problems. Anything else is a bug. */
  run: (args: string[]) => string[];
}

export class Registry {
  private commands = new Map<string, Command>();

  register(command: Command): this {
    this.commands.set(command.name, command);
    return this;
  }

  private aliases = new Map<string, string>();

  alias(alias: string, target: string): this {
    this.aliases.set(alias, target);
    return this;
  }

  get(name: string): Command | undefined {
    return this.commands.get(this.aliases.get(name) ?? name);
  }

  list(): Command[] {
    return [...this.commands.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  aliasesOf(name: string): string[] {
    return [...this.aliases].filter(([, target]) => target === name).map(([alias]) => alias);
  }
}
