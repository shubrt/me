---
title: "generated columns keep derived data in sync"
date: 2026-03-26
tags: [sql]
---

`alter table notes add column word_count int generated always as (array_length(regexp_split_to_array(body, '\\s+'), 1)) stored;`

The database maintains it, it can be indexed, and no application code can forget to update it.
