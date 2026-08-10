---
title: "named slots and slot fallbacks"
date: 2025-12-16
tags: [astro]
---

`<slot name="aside" />` in the layout, `<aside slot="aside">` in the page. Content inside `<slot>...</slot>` is the fallback when nothing is passed.

`Astro.slots.has("aside")` lets the layout skip a wrapper when the slot is empty.
