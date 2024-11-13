---
title: "set -euo pipefail, and what each flag does"
date: 2024-11-13
tags: [shell]
---

`-e` exits on the first failing command, `-u` errors on unset variables, `-o pipefail` makes a pipeline fail if any stage fails, not just the last.

Without `pipefail`, `curl ... | jq` succeeds when curl fails and jq gets empty input.
