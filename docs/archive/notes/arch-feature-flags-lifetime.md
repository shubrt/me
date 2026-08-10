---
title: "feature flags need a removal date"
date: 2026-03-30
tags: [architecture]
---

Every flag gets an owner and a date in a comment. A flag older than its date is a bug in the backlog.

Otherwise the code slowly becomes a tree of `if (flags.x)` that nobody dares to prune.
