---
title: "dvh instead of vh on mobile"
date: 2026-02-14
tags: [css]
---

`min-height: 100dvh` uses the dynamic viewport height, which shrinks when the mobile browser bar is visible. `100vh` is the largest possible viewport and overflows.

`svh` is the smallest, `lvh` the largest, `dvh` follows the current state.
