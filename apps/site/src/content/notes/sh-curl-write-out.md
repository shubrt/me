---
title: "curl -w for timing and status"
date: 2026-02-19
tags: [shell, http]
---

`curl -s -o /dev/null -w '%{http_code} %{time_total}s\n' https://example.com` prints the status and the total time, nothing else.

`%{time_starttransfer}` is time to first byte, which is the number that usually matters.
