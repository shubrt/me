---
title: "is:inline scripts run before anything else"
date: 2025-01-14
tags: [astro]
---

A plain `<script>` in Astro is bundled and deferred. `<script is:inline>` is written into the HTML as is, so it runs while the page parses.

That is the right place for the dark mode class, so there is no flash before the bundle arrives.
