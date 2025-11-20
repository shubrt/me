---
title: "svg files as components"
date: 2025-07-14
tags: [astro]
---

`import Logo from "./logo.svg"; <Logo width={24} class="icon" />` inlines the SVG and passes attributes through. Astro 5.7 made it stable.

No more copying SVG markup into .astro files and forgetting to update one of them.
