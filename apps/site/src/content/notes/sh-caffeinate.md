---
title: "caffeinate keeps the mac awake for one command"
date: 2025-06-14
tags: [shell, mac]
---

`caffeinate -i npm run build:all` prevents idle sleep until the command exits. `-d` also keeps the display on.

Beats changing the energy settings and forgetting to change them back.
