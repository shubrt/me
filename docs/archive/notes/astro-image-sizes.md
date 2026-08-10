---
title: "astro:assets Image needs width or densities"
date: 2026-02-23
tags: [astro]
---

`<Image src={photo} widths={[400, 800]} sizes="(max-width: 600px) 400px, 800px" alt="..." />` generates a srcset. Without `widths` or `densities` it emits one image at the source size.

Local images get their dimensions inferred at build. Remote ones need explicit `width` and `height`.
