---
title: "navigator.clipboard.writeText"
date: 2026-01-19
tags: [web]
---

`await navigator.clipboard.writeText(text)` needs a user gesture and a secure context. Reading needs a permission prompt in most browsers.

The old `document.execCommand("copy")` still works but is deprecated and needs a hidden textarea.
