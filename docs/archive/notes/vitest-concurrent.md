---
title: "describe.concurrent for slow independent tests"
date: 2026-02-17
tags: [testing]
---

`describe.concurrent(...)` runs the tests inside in parallel. Inside, use the `expect` from the test context (`({ expect }) => ...`), the global one is not concurrency safe for snapshots.

Only worth it for tests that wait on something. Pure functions are already fast.
