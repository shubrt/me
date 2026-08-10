---
title: "preload is for this page, prefetch for the next"
date: 2026-04-27
tags: [performance]
---

`<link rel="preload">` fetches something the current page needs soon, at high priority. `<link rel="prefetch">` fetches something a later navigation might need, at idle priority.

Preloading a font the page uses is right. Preloading everything makes the page slower.
