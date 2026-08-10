---
title: "color-mix() for derived colors"
date: 2025-12-18
tags: [css]
---

`background: color-mix(in oklch, var(--accent), transparent 80%);` gives a tinted version of any color without a second variable.

Mixing in `oklch` keeps the perceived brightness steadier than `srgb`.
