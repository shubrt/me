---
title: "class:list in astro"
date: 2024-12-05
tags: [astro]
---

`<a class:list={["link", { active: isActive }, size && \`link-\${size}\`]}>` joins strings, arrays and objects with truthy keys, like `clsx` built in.

Falsy entries are dropped, so no more `${cond ? "x" : ""}` in templates.
