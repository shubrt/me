---
title: "pin actions to a sha"
date: 2026-03-06
tags: [ci, security]
---

`uses: actions/checkout@<full sha> # v4.2.2` instead of `@v4`. Tags can be moved, commit hashes cannot.

Dependabot updates the pinned hash and the comment together, so the maintenance cost is a merge click.
