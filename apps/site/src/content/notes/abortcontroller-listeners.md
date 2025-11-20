---
title: "AbortController removes event listeners in bulk"
date: 2025-07-16
tags: [web]
---

`el.addEventListener("click", fn, { signal: controller.signal })` for every listener, then `controller.abort()` removes all of them.

No more keeping references to handlers just to remove them later.
