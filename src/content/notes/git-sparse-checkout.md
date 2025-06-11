---
title: "sparse checkout for one folder of a big repo"
date: 2025-06-11
tags: [git]
---

`git clone --filter=blob:none --sparse <url>` then `git sparse-checkout set apps/site` gives a working tree with only that folder. The rest exists in history but not on disk.

Blob filtering means the clone itself is small too. Good for CI jobs that touch one package.
