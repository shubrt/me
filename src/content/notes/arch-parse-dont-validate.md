---
title: "parse, don't validate"
date: 2025-06-18
tags: [architecture, typescript]
---

A function that checks input and returns `boolean` leaves the caller with the same untyped value. A function that parses returns a new, narrower type or fails.

Zod schemas at the edge, plain typed values inside. The inside never checks again.
