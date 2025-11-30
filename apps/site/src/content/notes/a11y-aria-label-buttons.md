---
title: "icon buttons need a name"
date: 2025-11-30
tags: [a11y]
---

A button with only an SVG inside has no accessible name. `aria-label="Toggle dark mode"` on the button, and `aria-hidden="true"` on the SVG.

The lighthouse warning is easy to ignore. The screen reader announcing "button" with nothing else is not.
