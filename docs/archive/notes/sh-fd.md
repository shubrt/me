---
title: "fd is find with sane defaults"
date: 2025-02-21
tags: [shell]
---

`fd config` finds files matching "config", ignores `.gitignore`d paths and hidden files, and colors the output.

`fd -e ts -x wc -l` runs a command per file. I still know `find`, I just stopped typing it.
