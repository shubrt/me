---
title: "asserts condition functions"
date: 2025-02-11
tags: [typescript]
---

`function assert(cond: unknown, msg?: string): asserts cond { if (!cond) throw new Error(msg); }`

After `assert(user)`, TypeScript narrows `user` to non-nullable for the rest of the block. Works like an if-guard without the indentation.
