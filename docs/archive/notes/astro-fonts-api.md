---
title: "the experimental fonts api"
date: 2026-04-29
tags: [astro]
---

`experimental: { fonts: [{ provider: fontProviders.google(), name: "Inter", cssVariable: "--font-inter" }] }` downloads the font at build and emits preload tags via `<Font cssVariable="--font-inter" preload />`.

Self-hosting without a manual download step. Still experimental in the 5.x line, so I am watching rather than using.
