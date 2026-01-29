---
title: "JSON.stringify with a replacer array"
date: 2026-01-29
tags: [javascript]
---

`JSON.stringify(user, ["id", "name"])` keeps only those keys, at every nesting level. Handy for logging objects that carry tokens.

A function replacer can redact instead: return `undefined` to drop a key.
