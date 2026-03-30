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
