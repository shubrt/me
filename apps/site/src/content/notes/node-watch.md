---
title: "node --watch replaces nodemon"
date: 2025-06-11
tags: [node]
---

`node --watch src/server.ts` restarts on changes to the entry file and anything it imports. Stable since Node 22.

`--watch-path` watches extra directories, for config files that are read at runtime.
