import type { Line } from "./reducer.ts";

export interface SchedulerOptions {
  /** Milliseconds between lines. */
  delay: number;
  setTimeout?: (fn: () => void, ms: number) => unknown;
}

/**
 * Emits lines one after another so output feels typed rather than pasted.
 * With delay 0 (reduced motion) every line goes out synchronously.
 */
export function createScheduler(emit: (line: Line) => void, options: SchedulerOptions) {
  const queue: Line[] = [];
  const later = options.setTimeout ?? ((fn, ms) => setTimeout(fn, ms));
  let running = false;

  const tick = () => {
    const next = queue.shift();
    if (!next) {
      running = false;
      return;
    }
    emit(next);
    later(tick, options.delay);
  };

  return {
    push(lines: Line[]) {
      queue.push(...lines);
      if (!running) {
        running = true;
        tick();
      }
    },
    pending: () => queue.length,
  };
}
