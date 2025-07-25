---
title: "structuredClone instead of JSON round trips"
date: 2025-07-25
tags: [node, web]
---

`structuredClone(obj)` deep copies and keeps `Date`, `Map`, `Set`, typed arrays and cycles. `JSON.parse(JSON.stringify(obj))` turns dates into strings and drops `undefined`.

Functions and DOM nodes throw, which is a fair limit.
