---
title: "node --env-file replaces dotenv"
date: 2025-01-03
tags: [node]
---

`node --env-file=.env server.js` loads the file into `process.env` before the script runs. Node 20.6 and up.

One dependency less. The syntax is the usual KEY=value, comments with #.
