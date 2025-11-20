---
title: "returning gives back the inserted row"
date: 2025-02-06
tags: [sql]
---

`insert into notes (title) values ('x') returning id, created_at;` saves a second query for the generated columns.

Postgres and SQLite (3.35 and up) support it. MySQL does not, which surprised me.
