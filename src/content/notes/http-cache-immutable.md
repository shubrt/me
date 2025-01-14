---
title: "cache-control immutable for hashed assets"
date: 2025-01-14
tags: [http]
---

`Cache-Control: public, max-age=31536000, immutable` tells the browser not to revalidate even on reload. Safe only when the filename contains a content hash.

HTML gets the opposite: `no-cache`, so every visit checks for a new build.
