---
title: "URLSearchParams handles the encoding"
date: 2025-06-17
tags: [web]
---

`const u = new URL(base); u.searchParams.set("q", "a b&c"); u.toString()` encodes correctly. String concatenation gets it wrong exactly when a value contains `&` or `#`.

`Object.fromEntries(u.searchParams)` turns them into a plain object.
