---
title: "zsh ** and extended_glob"
date: 2025-07-31
tags: [shell]
---

`ls **/*.test.ts` recurses without `find`. `setopt extended_glob` adds negation: `rm -- ^*.md` removes everything except markdown files.

`**` is on by default in zsh, unlike bash where `globstar` needs enabling.
