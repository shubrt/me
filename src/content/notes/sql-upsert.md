---
title: "insert on conflict do update"
date: 2025-03-25
tags: [sql]
---

`insert into counters (key, n) values ('visits', 1) on conflict (key) do update set n = counters.n + excluded.n;`

`excluded` is the row that would have been inserted. One statement, atomic, no select-then-insert race.
