---
title: "Temporal is finally shipping"
date: 2025-07-02
tags: [javascript]
---

`Temporal.PlainDate.from("2025-06-15").add({ months: 1 })` and no mutable Date, no zero-based months, real time zones with `ZonedDateTime`.

Firefox shipped it unflagged in 139. Chrome and Safari are behind flags. The polyfill is fine for server code today.
