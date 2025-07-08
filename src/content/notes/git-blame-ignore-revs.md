---
title: "blame.ignoreRevsFile hides formatting commits"
date: 2025-07-08
tags: [git]
---

A file `.git-blame-ignore-revs` with one commit hash per line, plus `git config blame.ignoreRevsFile .git-blame-ignore-revs`. Blame then skips those commits and shows the real author.

GitHub reads the same file automatically. Worth adding right after a big reformat.
