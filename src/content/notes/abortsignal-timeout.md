---
title: "AbortSignal.timeout for fetch"
date: 2025-02-21
tags: [node, web]
---

`fetch(url, { signal: AbortSignal.timeout(5000) })` rejects with a `TimeoutError` after five seconds. No manual `AbortController` and `setTimeout`.

`AbortSignal.any([a, b])` combines signals, for a timeout plus a user cancel.
