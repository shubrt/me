---
title: "astro sessions"
date: 2025-07-02
tags: [astro]
---

`Astro.session.set("cart", items)` and `Astro.session.get("cart")` with a cookie-backed session and a pluggable driver (memory, redis, filesystem).

Stable in 5.7 after a few experimental releases. Only relevant with an SSR adapter, which this site does not have. Noted anyway.
