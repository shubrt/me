---
title: "narrowing after destructuring a discriminant"
date: 2025-08-28
tags: [typescript]
---

Since 4.6, `const { kind, payload } = action; if (kind === "add") payload.x` narrows `payload` even though `kind` was pulled out of the object.

Only works with `const` destructuring. With `let` the link is lost.
