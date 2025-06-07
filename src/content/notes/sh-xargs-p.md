---
title: "xargs -P runs things in parallel"
date: 2025-06-07
tags: [shell]
---

`ls *.png | xargs -P 4 -I{} cwebp {} -o {}.webp` converts four images at a time.

Cheap parallelism for embarrassingly parallel work. GNU parallel does more, but xargs is already there.
