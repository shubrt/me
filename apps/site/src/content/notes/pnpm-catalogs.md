---
title: "pnpm catalogs pin versions once per workspace"
date: 2025-11-16
tags: [pnpm]
---

In `pnpm-workspace.yaml`: `catalog: { typescript: ^5.6.0 }`. In every package.json: `"typescript": "catalog:"`.

One place to bump, no more three packages on three TypeScript versions. pnpm 9.5 and up.
