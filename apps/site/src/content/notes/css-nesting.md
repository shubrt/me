---
title: "native css nesting"
date: 2024-12-06
tags: [css]
---

`.card { color: gray; &:hover { color: black; } .title { font-weight: 600; } }` works in browsers without a preprocessor.

The relaxed syntax (no `&` needed before element selectors) landed in all engines during 2024. Sass is now a choice, not a requirement.
