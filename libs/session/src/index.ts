// Public API of the terminal core. Pure functions, no React, no DOM.

export { ageVersion, blocks, fmt, round100, tk } from "./format.ts";
export {
  prepareData,
  type Answer,
  type CommandMeta,
  type Rng,
  type SessionData,
  type Step,
} from "./registry.ts";
export {
  commandRow,
  cookedRow,
  expandStep,
  line,
  pendingRow,
  statusRow,
  type Row,
} from "./rows.ts";
export {
  contextUsage,
  createInitialState,
  menuList,
  menuQuery,
  pendingElapsed,
  pendingGlyph,
  reduce,
  resolve,
  toolCount,
  type Job,
  type PlannedStep,
  type SessionAction,
  type SessionState,
} from "./session.ts";
export { CONTEXT_LIMIT, outTokens, resTokens } from "./tokens.ts";
