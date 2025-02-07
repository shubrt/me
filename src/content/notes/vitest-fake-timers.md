---
title: "vitest fake timers"
date: 2025-02-07
tags: [testing]
---

`vi.useFakeTimers(); vi.setSystemTime(new Date("2025-01-15"));` fixes `Date.now()` and lets `vi.advanceTimersByTime(1000)` fire timeouts synchronously.

`vi.useRealTimers()` in `afterEach`, or the next test file inherits a frozen clock.
