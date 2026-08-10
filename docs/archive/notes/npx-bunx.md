---
title: "npx versus bunx"
date: 2025-12-04
tags: [node, bun]
---

Both run a package binary, installing it if needed. `bunx` caches globally and starts noticeably faster. `npx` respects the project's lockfile when the package is already a dependency.

I use bunx for one-off tools and the package manager's own `run` for project scripts.
