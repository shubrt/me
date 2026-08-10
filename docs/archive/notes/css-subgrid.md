---
title: "subgrid aligns nested items to the parent grid"
date: 2025-06-08
tags: [css]
---

`.card { display: grid; grid-template-rows: subgrid; grid-row: span 3; }` makes title, text and footer of every card line up across the row.

The classic "equal height cards with aligned footers" problem, solved without flex hacks.
