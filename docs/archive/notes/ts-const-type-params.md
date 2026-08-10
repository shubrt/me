---
title: "const type parameters"
date: 2025-01-15
tags: [typescript]
---

`function tuple<const T extends readonly unknown[]>(t: T) { return t; }`

Calling `tuple(["a", "b"])` infers `readonly ["a", "b"]` instead of `string[]`. Before TypeScript 5.0 the caller had to write `as const`.
