---
title: "input type datetime-local has no timezone"
date: 2026-05-08
tags: [web]
---

The value is `2025-03-10T14:30`, local to the user, no offset. Sending it to a server as is means the server has to know the user's zone.

Convert with `new Date(value).toISOString()` in the browser before submitting, or store the zone alongside.
