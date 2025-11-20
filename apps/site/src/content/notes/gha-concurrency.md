---
title: "concurrency groups cancel superseded runs"
date: 2025-09-10
tags: [ci]
---

`concurrency: { group: ci-\${{ github.ref }}, cancel-in-progress: true }` in a workflow cancels the previous run on the same branch when a new push arrives.

For deploys, set `cancel-in-progress: false` so a half-finished deploy is not killed.
