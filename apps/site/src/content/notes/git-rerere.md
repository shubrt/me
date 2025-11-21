---
title: "git rerere remembers conflict resolutions"
date: 2025-11-21
tags: [git]
---

`git config rerere.enabled true` makes git record how a conflict was resolved. If the same conflict shows up again during a rebase, it is replayed.

Useful on long-lived branches that get rebased repeatedly. I found it after resolving the same three hunks for the fourth time.
