---
title: "astro:env typed environment variables"
date: 2026-04-20
tags: [astro]
---

Declare in the config: `env: { schema: { GITHUB_TOKEN: envField.string({ context: "server", access: "secret", optional: true }) } }`, then `import { GITHUB_TOKEN } from "astro:env/server"`.

The build fails early if a required variable is missing, and client code cannot import server secrets by accident.
