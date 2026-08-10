---
title: "sqlite wal mode"
date: 2025-07-25
tags: [sql, sqlite]
---

`pragma journal_mode = wal;` lets readers proceed while a writer writes. The default rollback journal blocks readers during a write.

For anything with more than one connection it is the first setting to change. It persists in the database file.
