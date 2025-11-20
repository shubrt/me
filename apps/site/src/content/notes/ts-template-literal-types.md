---
title: "template literal types for string patterns"
date: 2025-06-12
tags: [typescript]
---

`type EventName = \`on\${Capitalize<string>}\`;` accepts `onClick` and rejects `click`.

Combined with `infer` inside a conditional type they can pick pieces out of strings, like extracting route parameters from `"/users/:id"`. Fun, and easy to overdo.
