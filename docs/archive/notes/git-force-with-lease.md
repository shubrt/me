---
title: "force-with-lease instead of force"
date: 2025-02-06
tags: [git]
---

`git push --force-with-lease` refuses to push if the remote branch moved since my last fetch. Plain `--force` overwrites whatever is there.

I aliased `pushf` to the lease variant so I stop thinking about it.
