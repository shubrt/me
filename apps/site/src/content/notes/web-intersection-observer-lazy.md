---
title: "IntersectionObserver for lazy anything"
date: 2026-01-13
tags: [web]
---

`new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && load(e.target)), { rootMargin: "200px" }).observe(el)`

The `rootMargin` starts loading before the element is visible. Images have `loading="lazy"`, but for iframes and heavy components this is the tool.
