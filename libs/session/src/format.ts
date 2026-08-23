// Pure formatting helpers, shared by the reducer and the Astro shell.

/** "1780" -> "1.8k", numbers below 1000 stay plain. */
export function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

/** Rough token count for text in a monospace UI, English-ish density. */
export function tk(s: string): number {
  return Math.max(1, Math.round(s.length / 3.6));
}

const BLOCKS = " ▁▂▃▄▅▆▇█";

/**
 * Weekly commit counts as block characters, the terminal version of a
 * sparkline. Scaled against the busiest repo overall, not against the own
 * row, so a quiet repo reads as quiet.
 */
export function blocks(values: number[], globalMax: number): string {
  const top = globalMax || 1;
  return values.map((v) => BLOCKS.charAt(Math.min(8, Math.round((v / top) * 8)))).join("");
}

/**
 * Version from the birth date: full years . months since the last
 * birthday . additional days. Born 1998-09-18.
 */
export function ageVersion(now = new Date()): string {
  let y = now.getFullYear() - 1998;
  let m = now.getMonth() - 8;
  let d = now.getDate() - 18;
  if (d < 0) {
    m -= 1;
    d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }
  return `v${y}.${m}.${d}`;
}

/** Round to the nearest hundred, never below 100. */
export function round100(n: number): number {
  return Math.max(100, Math.round(n / 100) * 100);
}
