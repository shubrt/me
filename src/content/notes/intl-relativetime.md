---
title: "Intl.RelativeTimeFormat for 3 days ago"
date: 2025-02-06
tags: [web, intl]
---

`new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-1, "day")` gives "yesterday", `format(-3, "day")` gives "3 days ago".

Picking the unit is still my job, but the wording and localisation are not. Dropped a small dependency for it.
