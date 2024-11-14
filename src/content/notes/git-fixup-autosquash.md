---
title: "fixup commits and rebase --autosquash"
date: 2024-11-14
tags: [git]
---

`git commit --fixup=<sha>` creates a commit named `fixup! <original subject>`. A later `git rebase -i --autosquash` moves it behind the original and marks it as fixup automatically.

With `git config rebase.autosquash true` the flag is not even needed. Reviewing my own branch got noticeably faster.
