---
title: "verbatimModuleSyntax and import type"
date: 2025-06-24
tags: [typescript]
---

With the flag on, any import used only as a type must be written `import type`. TypeScript then never has to guess what to drop from the output.

The errors are annoying for a day and then the imports are simply correct.
