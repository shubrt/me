---
title: "yaml parses unquoted dates into date objects"
date: 2025-01-15
tags: [yaml, markdown]
---

In frontmatter, `date: 2025-01-15` arrives as a `Date` at midnight UTC, `date: "2025-01-15"` as a string. Timezone shifts then make the date show as the 14th for some readers.

Schema with `z.coerce.date()` and always format in UTC, or store strings and parse deliberately.
