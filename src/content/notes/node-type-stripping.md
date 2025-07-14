---
title: "node runs typescript files now"
date: 2025-07-14
tags: [node, typescript]
---

`node script.ts` works without flags since 23.6 (22.6 behind `--experimental-strip-types`). Types are removed, nothing is type-checked, and enums or parameter properties are rejected.

For scripts in a repo this beats `tsx`. Type checking stays a separate `tsc --noEmit` step.
