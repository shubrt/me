---
title: "Intl.NumberFormat compact notation"
date: 2026-02-18
tags: [web, intl]
---

`new Intl.NumberFormat("en", { notation: "compact" }).format(1780)` gives "1.8K". `maximumFractionDigits: 1` controls the rounding.

Good enough for star counts. I still keep a tiny `fmt` helper because I want a lowercase k.
