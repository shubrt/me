---
title: "docker compose watch syncs files without a bind mount"
date: 2026-02-26
tags: [docker]
---

`develop: { watch: [{ action: sync, path: ./src, target: /app/src }] }` in the compose file, then `docker compose watch`. Changes are copied into the container, `action: rebuild` rebuilds on dependency changes.

Faster than bind mounts on macOS, where file system events across the VM are slow.
