---
title: "row_number() over partition for latest per group"
date: 2025-06-24
tags: [sql]
---

`select * from (select *, row_number() over (partition by user_id order by created_at desc) as rn from events) t where rn = 1;`

"Latest event per user" without a correlated subquery. Window functions were the SQL feature I put off learning the longest.
