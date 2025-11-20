---
title: "the dialog element does the modal work"
date: 2025-03-25
tags: [web, a11y]
---

`dialog.showModal()` opens it on the top layer, traps focus, closes on Escape, and `::backdrop` styles the overlay.

Return focus to the opener is handled too. Most modal libraries are now a polyfill for old Safari.
