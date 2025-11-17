---
title: "workspace:* and what gets published"
date: 2025-11-17
tags: [pnpm]
---

`"@me/utils": "workspace:*"` links the local package. On publish pnpm rewrites it to the actual version.

For private monorepos the rewrite never happens and `*` just means "whatever is in the repo", which is what I want.
