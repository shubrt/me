---
title: "comm compares two sorted lists"
date: 2025-07-08
tags: [shell]
---

`comm -23 <(sort a.txt) <(sort b.txt)` prints lines only in a. `-13` only in b, `-12` in both.

The columns are "only in first", "only in second", "in both", and the digits suppress columns. Odd interface, does the job.
