---
title: "light-dark() picks a color per scheme"
date: 2025-05-23
tags: [css]
---

`color-scheme: light dark;` on `:root`, then `color: light-dark(#222, #eee);`. No media query per property.

Supported everywhere since May 2024. For a toggle-driven theme it is less useful, since the function follows `color-scheme`, not a class. Setting `color-scheme` from the class works though.
