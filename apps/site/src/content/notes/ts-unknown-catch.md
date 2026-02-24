---
title: "useUnknownInCatchVariables"
date: 2026-02-24
tags: [typescript]
---

Under `strict`, the catch variable is `unknown` and `err.message` does not compile. `if (err instanceof Error)` first, or a small `toError(unknown): Error` helper.

It is right. Anything can be thrown.
