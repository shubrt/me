# Local work

## Worktrees and services

- Worktree setup in `t3.json` runs `vp i` and links the root `.env`. Do not invent credentials.
- Setup does not start apps or run tests. Perform necessary task preparation explicitly through existing `vp run ...` commands later.
- Discover actual scripts and package names in the checkout. `vp run qa` runs every repository check.
- `vp run -F @shubrt/web dev` serves the pages only, and Astro allows one dev server per project. The contact form needs the preview.

## Preview

`vp run build`, then `vp run -F @shubrt/web preview`, serves the built pages and the worker on `http://localhost:8787`.

After an app change:

1. Run `vp run build`. The preview serves `apps/web/dist` and reloads after a rebuild, so a running preview needs no restart.
2. Reuse a preview this checkout already runs. Do not replace another worktree's server; pick a free port with `vp run -F @shubrt/web preview --port <port>` instead.
3. If absent, start the preview as a background process owned by the agent session. Keep the session as its parent; do not use `nohup` or `setsid`.
4. Wait until the actual preview URL is reachable. Put that URL on the last line of the final response.
5. Do not manually stop these preview servers. Their lifetime belongs to the session.

Documentation-only changes need no app start. A reachability check is delivery verification, not a reason to add a permanent server-start test. If a required preview cannot run, report the concrete blocker instead of claiming it is available.

## External systems

The preview simulates the mail binding: each send prints sender, recipient and subject, and no mail leaves the machine. Leave `"remote": true` off the binding. Use controlled responses or local fixtures for relevant tests.

There is no test account for Cloudflare. That does not authorize live mails, `wrangler deploy`, or DNS and dashboard changes. Name and check the actual target before any authorized data-changing command.
