---
title: "Intl.ListFormat joins with the right commas"
date: 2025-07-07
tags: [web, intl]
---

`new Intl.ListFormat("en", { type: "conjunction" }).format(["a", "b", "c"])` gives "a, b, and c". German gives "a, b und c".

The Oxford comma debate, outsourced to the locale.
