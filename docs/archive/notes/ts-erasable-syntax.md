---
title: "erasableSyntaxOnly for running ts with node"
date: 2025-07-14
tags: [typescript, node]
---

Node strips types but does not compile enums, namespaces or parameter properties. TypeScript 5.8 added `erasableSyntaxOnly`, which errors on exactly those.

Turn it on if the code should run with `node file.ts`. It also nudges toward plain objects instead of enums, which I prefer anyway.
