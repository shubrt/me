---
title: "container queries"
date: 2025-01-09
tags: [css]
---

`.grid { container-type: inline-size; }` then `@container (min-width: 40rem) { .card { display: flex; } }`.

Components respond to the space they are in, not the viewport. Same card, sidebar or main column, no extra classes.
