---
title: "etag and if-none-match"
date: 2025-06-12
tags: [http]
---

The server sends `ETag: "abc"`, the client later sends `If-None-Match: "abc"`, the server answers `304 Not Modified` with no body.

Static hosts do this for free. For an API endpoint, hashing the JSON body is enough to get the same effect.
