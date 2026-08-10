---
title: "node:sqlite ships with node 22.5"
date: 2026-03-23
tags: [node]
---

`import { DatabaseSync } from "node:sqlite";` behind `--experimental-sqlite` at first, unflagged later. Synchronous API, same shape as bun:sqlite more or less.

Both runtimes now have sqlite built in. Small tools no longer need a native dependency anywhere.
