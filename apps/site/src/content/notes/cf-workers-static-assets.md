---
title: "workers can serve static assets directly"
date: 2026-05-06
tags: [cloudflare]
---

`assets: { directory: "./dist" }` in wrangler config serves the folder from the edge, with a worker script optional in front of it.

Pages and Workers are converging. For a static site the difference is now mostly which dashboard.
