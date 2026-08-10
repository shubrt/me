---
title: "inert disables a whole subtree"
date: 2025-09-24
tags: [web, a11y]
---

`<main inert>` makes everything inside unfocusable and invisible to assistive tech. Useful behind a custom modal or during a page transition.

One attribute instead of walking the tree setting tabindex=-1.
