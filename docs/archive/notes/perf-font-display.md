---
title: "font-display swap versus optional"
date: 2025-09-13
tags: [performance, css]
---

`swap` shows fallback text immediately and swaps when the font arrives, causing a shift. `optional` uses the web font only if it is already cached, otherwise the fallback stays.

For body text on a small site `optional` is the honest choice. Nobody waits for a font.
