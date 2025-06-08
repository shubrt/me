---
title: "getStaticPaths props avoid a second lookup"
date: 2025-06-08
tags: [astro]
---

Returning `{ params: { slug }, props: { entry } }` from `getStaticPaths` hands the entry to the page as `Astro.props`. No need to fetch it again by slug in the page body.

Obvious in hindsight, but the docs example I copied did the double lookup.
