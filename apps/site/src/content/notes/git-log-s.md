---
title: "git log -S finds when a string appeared or vanished"
date: 2025-01-14
tags: [git]
---

`git log -S"useLegacyParser" --oneline` lists commits where the number of occurrences of the string changed. Unlike `-G`, it ignores commits that merely moved the line.

Add `-p` to see the diffs. Faster than bisecting when I know what to look for.
