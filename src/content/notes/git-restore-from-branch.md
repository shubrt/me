---
title: "git restore takes a file from another branch"
date: 2024-11-12
tags: [git]
---

`git restore --source=main -- src/config.ts` copies the file as it is on `main` into the working tree, without touching the index or switching branches.

I used to do `git checkout main -- file`, which also stages it. `restore` leaves that decision to me.
