---
title: "the transactional outbox"
date: 2026-02-26
tags: [architecture]
---

Write the event into an outbox table in the same transaction as the business change. A separate process reads the outbox and publishes.

No "database committed but the message never went out" bug. The price is at-least-once delivery, so consumers must be idempotent.
