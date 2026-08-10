---
title: "docker init generates a decent starting point"
date: 2026-05-12
tags: [docker]
---

`docker init` asks for the language and port and writes a Dockerfile, a compose file and a .dockerignore. The Node one is multi-stage and runs as a non-root user.

Better than what I would type from memory at the start of a project.
