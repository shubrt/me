---
title: "trap cleanup EXIT"
date: 2025-01-15
tags: [shell]
---

`tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT` removes the directory whether the script finishes, fails, or is interrupted.

One trap per script. Multiple traps on the same signal replace each other, they do not stack.
