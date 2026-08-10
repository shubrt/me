---
title: "prefers-reduced-motion is not optional"
date: 2025-07-16
tags: [css, a11y]
---

`@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`

A blunt reset, but a good default. Anything that should still move gets an exception below it.
