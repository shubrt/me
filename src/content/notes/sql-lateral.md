---
title: "lateral join is a for-each in sql"
date: 2025-09-15
tags: [sql]
---

`select u.*, r.* from users u, lateral (select * from repos where owner_id = u.id order by pushed_at desc limit 3) r;`

The subquery can reference the outer row. "Top 3 per user" in one readable statement.
