export interface Parsed {
  name: string;
  args: string[];
}

/** Splits a line into a command name and arguments. Double quotes group words. */
export function parse(line: string): Parsed | null {
  const tokens: string[] = [];
  let current = "";
  let quoted = false;
  for (const ch of line.trim()) {
    if (ch === '"') {
      quoted = !quoted;
      continue;
    }
    if (ch === " " && !quoted) {
      if (current) tokens.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  if (current) tokens.push(current);
  const [name, ...args] = tokens;
  if (!name) return null;
  return { name: name.toLowerCase(), args };
}
