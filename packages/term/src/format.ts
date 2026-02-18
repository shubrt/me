const BLOCKS = " ▁▂▃▄▅▆▇█";

/** Weekly counts as block characters, scaled against a shared maximum. */
export function blocks(values: number[], max: number): string {
  const top = max || 1;
  return values.map((v) => BLOCKS.charAt(Math.min(8, Math.round((v / top) * 8)))).join("");
}

/** 1780 -> "1.8k", below 1000 unchanged. */
export function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
