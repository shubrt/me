---
title: "util.parseArgs for small clis"
date: 2025-09-15
tags: [node]
---

`const { values, positionals } = parseArgs({ options: { verbose: { type: "boolean", short: "v" }, out: { type: "string" } }, allowPositionals: true });`

Handles `--out=x`, `--out x`, `-v` and `--`. For a script with three flags it replaces commander.
