# What the rewrite should do

Notes to myself, collected since the terminal prototype started doing real things.

## Keep

- The idea. A terminal that answers like a coding agent, with the portfolio as its content.
- `packages/term` as a framework-free core: parse, registry, reducer, scheduler. Tests are cheap there and they caught real bugs.
- Build-time GitHub data with a committed cache.

## Change

- One island, not a page full of small scripts. The prompt, the output and the status line are one component and share one state. The React detour in December was right about that and wrong about doing it early.
- The output should not be lines of text. It should be rows: a command row, tool rows with timing, a result block. That is what makes it read as an agent and not as a shell.
- Content as data with schemas. The `Content` bag in term is half of that. Contracts should own all of it.
- Drop the notes. Two years of them and they were the most honest part of the site, but they are not the portfolio. Archive the markdown, keep the RSS URL returning something sane.

## Do not

- Do not port the old pages. Start from the prototype and the docs, not from the Astro templates.
- Do not keep Tailwind by default. The terminal needs maybe two hundred lines of CSS and one font.
- Do not touch it until there is a full evening. Half-evenings produced the weeknotes.

## Plan, May 2026

1. New app, not a refactor. `apps/web`, the old site stays in `apps/site` until the new one deploys, then it goes.
2. One React island for the terminal. The session library stays framework-free and gets a reducer the island subscribes to. React is the right tool once the whole page is the terminal, see the December note.
3. Output as rows, not lines. Command row, step rows with timing, result blocks. The step/meta kinds in term are the sketch.
4. Contracts own every data shape. Repos, whoami, the lot. Zod, one file, tests.
5. Cloudflare Workers with static assets instead of Pages. Same edge, and the worker can grow if it has to.
6. No Tailwind, no notes, no now page. Everything the terminal cannot say does not go on the page.
7. Tooling from the pushdraft repo: vp, sherif, commitlint. It works there, copy it.

Astro major: whatever is current when I start. The site is static, the version matters less than it used to.

## Decisions

- Name of the session library: `libs/session`. `packages/term` was never about terminals, it was about state.
- Mascot stays, drawn properly this time. Two lines of ascii were a placeholder that people commented on more than anything else.
- The age based version number replaces `version`. It changes every day and means something.
- Start in August. Vacation, no meetings, full evenings.
