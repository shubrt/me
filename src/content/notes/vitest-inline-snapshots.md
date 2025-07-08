---
title: "inline snapshots stay next to the test"
date: 2025-07-08
tags: [testing]
---

`expect(result).toMatchInlineSnapshot()` writes the value into the test file on first run. Changes show up in the diff of the test, not in a separate folder.

For small objects it beats a .snap file. For large ones it does not.
