---
title: "define:vars passes server values into scripts"
date: 2025-03-26
tags: [astro]
---

`<script define:vars={{ apiBase }}>console.log(apiBase)</script>` injects the value as a const. It implies `is:inline`, so the script is not bundled.

For styles the same works: `<style define:vars={{ accent }}>` exposes `var(--accent)`.
