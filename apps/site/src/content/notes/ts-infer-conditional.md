---
title: "infer in conditional types"
date: 2025-12-12
tags: [typescript]
---

`type Unwrap<T> = T extends Promise<infer U> ? U : T;`

`infer` names a part of the matched type. `Awaited`, `ReturnType` and `Parameters` are all built this way, and reading their source made the feature click.
