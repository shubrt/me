---
title: "bun:sqlite is built in"
date: 2026-03-09
tags: [bun]
---

`import { Database } from "bun:sqlite"; const db = new Database("app.db"); db.query("select * from notes where tag = ?").all("git");`

Synchronous, fast, no native module to compile. For local tools it removed better-sqlite3 from my dependencies.
