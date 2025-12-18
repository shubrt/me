---
title: "node:test is good enough for small things"
date: 2025-12-18
tags: [node, testing]
---

`import { test } from "node:test"; import assert from "node:assert/strict";` and `node --test` runs every `*.test.js` file.

No config, no dependency. For a library with a dozen tests I no longer reach for a framework.
