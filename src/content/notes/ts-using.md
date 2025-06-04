---
title: "using declarations and Symbol.dispose"
date: 2025-06-04
tags: [typescript]
---

`using file = openFile(path);` calls `file[Symbol.dispose]()` when the block ends, including on throw. `await using` does the same with `Symbol.asyncDispose`.

TypeScript 5.2 supports it with a polyfill for the symbols. Feels like Go's `defer` with types.
