---
title: "satisfies keeps the literal type"
date: 2024-11-13
tags: [typescript]
---

`const routes = { home: "/", about: "/about" } satisfies Record<string, string>;`

The object is checked against the type but keeps its literal keys and values, so `routes.home` is still `"/"` and a typo in a key fails at the call site. An annotation with `: Record<string, string>` would widen everything to `string`.
