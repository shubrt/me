/** Command history with arrow-key style navigation. Newest entry last. */
export class History {
  private entries: string[] = [];
  private cursor = 0;

  push(line: string): void {
    if (line.trim() === "") return;
    if (this.entries.at(-1) === line) {
      this.cursor = this.entries.length;
      return;
    }
    this.entries.push(line);
    this.cursor = this.entries.length;
  }

  /** Move towards older entries. Returns undefined at the oldest. */
  back(): string | undefined {
    if (this.cursor === 0) return undefined;
    this.cursor -= 1;
    return this.entries[this.cursor];
  }

  /** Move towards newer entries. Returns "" once past the newest. */
  forward(): string {
    if (this.cursor >= this.entries.length) return "";
    this.cursor += 1;
    return this.entries[this.cursor] ?? "";
  }

  all(): readonly string[] {
    return this.entries;
  }
}
