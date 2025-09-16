---
title: "builder functions instead of fixture files"
date: 2025-09-16
tags: [testing]
---

`const repo = (over: Partial<Repo> = {}): Repo => ({ id: "01", name: "x", stars: 0, ...over });`

Each test states only what matters for it. A JSON fixture file hides which of its twenty fields the test depends on.
