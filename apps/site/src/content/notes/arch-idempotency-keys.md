---
title: "idempotency keys for retried requests"
date: 2025-07-16
tags: [architecture, http]
---

The client sends a unique key with a write request. The server stores the key with the result and returns the stored result for any repeat.

Retries become safe. Stripe's API is the reference design and it is worth reading their docs even if you never use Stripe.
