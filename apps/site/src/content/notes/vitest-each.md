---
title: "it.each for table tests"
date: 2025-07-25
tags: [testing]
---

`it.each([[999, "999"], [1780, "1.8k"]])("formats %i as %s", (n, s) => expect(fmt(n)).toBe(s));`

Each row is its own test with a readable name. The template string variant with a markdown-ish table reads even better for three or more columns.
