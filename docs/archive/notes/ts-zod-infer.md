---
title: "z.infer keeps one source of truth"
date: 2025-11-26
tags: [typescript, zod]
---

Define the schema, derive the type: `const Repo = z.object({...}); type Repo = z.infer<typeof Repo>;`

The schema validates at the boundary, the type is used everywhere else. Writing both by hand always drifted within a month.
