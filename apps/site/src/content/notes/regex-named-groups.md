---
title: "named capture groups"
date: 2025-07-15
tags: [javascript]
---

`const m = /(?<year>\\d{4})-(?<month>\\d{2})/.exec(s); m?.groups?.year`

Replacement strings can use `$<year>` too. Indexed groups break silently when the pattern changes, names do not.
