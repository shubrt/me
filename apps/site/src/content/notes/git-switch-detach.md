---
title: "git switch --detach for looking around"
date: 2026-03-04
tags: [git]
---

`git switch --detach <sha>` checks out a commit without a branch, and says so clearly. `git checkout <sha>` does the same but the warning is easy to skim past.

`switch` and `restore` split the old `checkout` into two commands. I switched (sorry) in 2024 and did not miss anything.
