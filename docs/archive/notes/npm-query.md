---
title: "npm query selects packages with css syntax"
date: 2026-05-12
tags: [node]
---

`npm query ':attr(engines, [node="<18"])'` lists dependencies that declare an old node range. `npm query '#lodash'` shows every copy of lodash in the tree.

Weird idea, surprisingly practical for auditing.
