---
title: "pbcopy and pbpaste in pipelines"
date: 2025-07-15
tags: [shell, mac]
---

`git rev-parse HEAD | pbcopy` puts the hash on the clipboard. `pbpaste | jq .` formats whatever JSON I copied from a browser.

On Linux the equivalents are `xclip -selection clipboard` or `wl-copy`.
