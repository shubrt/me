---
title: "rg --files-without-match"
date: 2025-06-17
tags: [shell]
---

`rg --files-without-match 'export' src/` lists files that never export anything. Handy for finding dead modules or scripts that were meant to be modules.

`-l` is the opposite: files with at least one match.
