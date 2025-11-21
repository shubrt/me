# Monorepo split

The site has grown a `lib` folder that wants to be a package, and the terminal idea from docs/terminal-experiment.md needs code that has nothing to do with Astro. Plan:

- `apps/site`: the Astro site as it is today
- `packages/term`: command parsing, registry, session state. No DOM, no framework, tests with vitest.
- `packages/contracts`: later, zod schemas for the data the site and the terminal share

pnpm workspace, one biome config at the root, one lint and one test command that run everything. Packages export TypeScript source directly, no build step until something outside the repo needs them.

## Lockfile

Still not committed. I switch between bun and pnpm depending on mood and CI installs fresh anyway. The day something breaks because of a transitive update, this paragraph gets deleted and the lockfile gets added.
