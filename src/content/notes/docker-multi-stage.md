---
title: "multi-stage builds keep images small"
date: 2025-07-14
tags: [docker]
---

`FROM node:22 AS build` ... `FROM node:22-slim` then `COPY --from=build /app/dist ./dist`. Dev dependencies and build tools never reach the final image.

My image went from 1.1 GB to 180 MB with no change to the app.
