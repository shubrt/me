---
title: "exhaustive switch with never"
date: 2024-12-06
tags: [typescript]
---

`default: { const _exhaustive: never = kind; throw new Error(\`unhandled \${_exhaustive}\`); }`

Adding a variant to the union makes the assignment fail to compile. Cheaper than a lint rule and impossible to forget.
