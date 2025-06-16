---
title: "git bisect run with a script"
date: 2025-06-16
tags: [git]
---

`git bisect start bad good` then `git bisect run npm test` lets git do the halving. Exit code 0 is good, 1 to 127 is bad, 125 means skip this commit.

The skip code matters when a commit does not build. Took me one broken bisect to learn that.
