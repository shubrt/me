---
title: "git maintenance start"
date: 2025-05-21
tags: [git]
---

`git maintenance start` registers the repo for background tasks: commit-graph, prefetch, loose object cleanup. On macOS it installs launchd agents.

A few large repos got visibly faster for `git log` and `git status`. Nothing to lose on a small one.
