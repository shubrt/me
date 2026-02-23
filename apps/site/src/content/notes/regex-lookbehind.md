---
title: "lookbehind is supported everywhere now"
date: 2026-02-23
tags: [javascript]
---

`/(?<=\\$)\\d+/` matches digits after a dollar sign without including it. Safari was the holdout until 16.4 in 2023.

For parsing prices out of text it removed a post-processing step.
