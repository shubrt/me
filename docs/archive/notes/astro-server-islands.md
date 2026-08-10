---
title: "server islands defer one component"
date: 2025-07-02
tags: [astro]
---

`<Comments server:defer />` renders the page statically and fetches that component from the server after load, with a fallback slot in the meantime.

Astro 5 feature. The static page stays cacheable and only the dynamic bit costs a request.
