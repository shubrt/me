---
title: "set permissions: contents: read at the top"
date: 2026-01-09
tags: [ci, security]
---

Workflows get a write token by default in older repos. `permissions: contents: read` at the workflow level, and grant more only in the job that needs it.

A compromised action then cannot push. Cheap insurance.
