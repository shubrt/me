---
title: "bun $ shell for scripts"
date: 2025-07-04
tags: [bun]
---

`import { $ } from "bun"; const out = await $\`git rev-parse HEAD\`.text();` runs a command with proper escaping of interpolated values.

Cross-platform enough for scripts that used to be bash. Piping and `.quiet()` are there too.
