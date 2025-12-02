---
title: "set:html is a trust decision"
date: 2025-12-02
tags: [astro]
---

`<div set:html={rendered} />` inserts raw HTML. Astro escapes everything else, so this is the one place XSS can enter.

Fine for markdown I wrote, wrong for anything a user typed. The attribute name makes it easy to grep for.
