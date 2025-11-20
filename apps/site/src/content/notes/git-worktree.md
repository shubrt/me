---
title: "git worktree instead of stashing"
date: 2025-01-02
tags: [git]
---

`git worktree add ../hotfix main` checks out a second working copy that shares the same repository. No stash, no half-finished state, and `node_modules` stays put in the original.

`git worktree list` shows them, `git worktree remove` cleans up. Branches checked out in a worktree cannot be checked out twice, which is a feature.
