---
title: "shellcheck catches the quoting bugs"
date: 2025-12-19
tags: [shell]
---

`shellcheck deploy.sh` flags unquoted variables, useless `cat`, and `==` inside `[ ]`. Each warning has a wiki page with the reasoning.

Running it in CI on the few scripts I have costs nothing and has caught two real bugs.
