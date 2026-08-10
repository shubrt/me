---
title: "macOS date -j -f parses dates"
date: 2026-03-27
tags: [shell, mac]
---

`date -j -f '%Y-%m-%d' 2025-01-15 '+%A'` prints the weekday without touching the system clock. `-j` means "do not set", `-f` gives the input format.

GNU date does it with `date -d`. Scripts that run on both need a branch.
