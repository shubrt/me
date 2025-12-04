/** Completes a partial command name against the known names. */
export function complete(partial: string, names: readonly string[]): { value: string; candidates: string[] } {
  const p = partial.toLowerCase();
  const candidates = names.filter((n) => n.startsWith(p)).sort();
  if (candidates.length === 1) return { value: candidates[0] ?? partial, candidates };
  if (candidates.length === 0) return { value: partial, candidates };
  // longest common prefix of all candidates
  let prefix = candidates[0] ?? "";
  for (const c of candidates) {
    while (!c.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return { value: prefix, candidates };
}
