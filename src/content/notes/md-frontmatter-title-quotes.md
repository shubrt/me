---
title: "quote frontmatter titles with colons"
date: 2025-01-15
tags: [yaml, markdown]
---

`title: git: restore a file` is a yaml error, the second colon starts a mapping. `title: "git: restore a file"` works.

The error message points at the line, not at the colon. Took a minute I would like back.
