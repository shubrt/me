---
title: "noUncheckedIndexedAccess makes array access honest"
date: 2025-01-09
tags: [typescript]
---

With the flag on, `list[0]` has type `T | undefined`. That is what it actually is.

Turning it on in an existing codebase produces a wall of errors, most of them pointing at real assumptions. I now enable it on day one.
