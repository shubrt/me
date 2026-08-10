---
title: "Record<string, T> and noPropertyAccessFromIndexSignature"
date: 2026-01-12
tags: [typescript]
---

With `noPropertyAccessFromIndexSignature`, `config.port` is an error on a `Record<string, string>`, `config["port"]` is fine. The bracket makes the "this key may not exist" visible.

I disliked it for a week. Now dotted access on a record looks wrong to me.
