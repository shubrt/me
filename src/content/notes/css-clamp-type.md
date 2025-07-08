---
title: "fluid type with clamp()"
date: 2025-07-08
tags: [css]
---

`font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);` scales between the bounds without breakpoints.

The middle value needs a `rem` part so zooming still works. Pure `vw` breaks browser zoom.
