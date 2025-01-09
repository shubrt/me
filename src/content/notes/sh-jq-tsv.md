---
title: "jq -r with @tsv for shell-friendly output"
date: 2025-01-09
tags: [shell]
---

`jq -r '.[] | [.name, .stars] | @tsv'` prints tab-separated rows without quotes, ready for `while read` or `column -t`.

`-r` alone still leaves arrays as JSON. `@tsv` and `@csv` handle the escaping.
