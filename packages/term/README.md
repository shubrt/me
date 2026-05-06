# @shubrt/term

> Frozen since May 2026. Bug fixes only. The rewrite in docs/rewrite.md replaces this package with a session library that keeps the ideas and drops the code.

The terminal without a screen: parsing, commands, state. No DOM, no framework. The site renders whatever this produces.

## Commands

| command | does |
| --- | --- |
| `help` | lists this table |
| `whoami` | the intro |
| `projects` | one line per project |
| `notes [n]` | the latest notes |
| `uses` | tools |
| `now` | what I am up to |
| `theme dark\|light` | switches the theme |
| `open github\|mail\|notes\|rss` | follows a link |
| `clear` | clears the output |

Tab completes command names, arrow keys walk the history.
