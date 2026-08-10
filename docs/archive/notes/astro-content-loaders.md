---
title: "content layer loaders can read anything"
date: 2025-02-04
tags: [astro]
---

Astro 5 collections take a `loader`. `glob({ pattern: "**/*.md", base: "./src/notes" })` is the file case, but a loader is just an async function that calls `store.set()`.

A collection backed by a JSON API or a database is a few lines. Still builds statically.
