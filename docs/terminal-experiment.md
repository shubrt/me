# The terminal look, four months in

Started in May 2025: monospace font, fake prompt lines above sections, a window title bar, a status line footer, a typing animation and keyboard navigation.

## What stayed

- Monospace everything. It reads fine and it looks like me.
- The window frame around the content. Cheap, and it makes the page feel like one object.
- The status line footer. Links belong there.

## What went

- Keyboard navigation with j and k. Nobody expects it on a website, and I kept triggering it while typing in the notes search.
- The typing animation. Fun for a day, then it was the thing in the way of reading my own page.
- The fake command lines. They looked like decoration because they were decoration. Nothing happened when you read them.

## What I actually want

The commands should do something. A prompt where typing `projects` lists projects and `whoami` prints the intro. Not a decoration of a terminal, a small one. That is a bigger build than an evening, so it goes on the list for winter.

## Part two, March 2026

The prompt is real. `packages/term` parses, dispatches and streams, the site renders. Fourteen commands, tab completion, history, a face that blinks.

What I notice: the interesting part is not the shell. It is the moment the output looks like something is working for you. A command that streams three lines and a timing feels like an agent. A command that dumps a list feels like a menu. The rewrite should lean into the first one.
